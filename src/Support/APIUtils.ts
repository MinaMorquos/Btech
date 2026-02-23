import {request, expect} from '@playwright/test';
import {RunnerProp} from '../../RunnerProp';
import {CustomWorld} from "./CustomWorld";

export async function getReferenceNumbers(world:CustomWorld,status: string, token: string,keyFromJson:string,jsonObject:string): Promise<string[] | null> {
    if (!token) {
        console.error("TOKEN is missing. Cannot proceed with API call.");
        return null;
    }

    const valueFromJson = world.projectData[RunnerProp.env][jsonObject][keyFromJson];

    const API_URL = "https://qagate.gov.ae/api/workspace";

    const apiContext = await request.newContext();

    try {
        const response = await apiContext.get(API_URL, {
            headers: {
                "TOKEN": token
            },
            params: {
                filter: status,
                pageSize: "10000",
                pageNumber: "1",
                q: ""
            }
        });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        if (responseBody?.response?.workspaceItems) {
            return responseBody.response.workspaceItems
                .filter((item: any) =>
                    item.violationSubType?.nameEn?.trimEnd() === valueFromJson?.trimEnd()
                )
                .map((item: any) => item.referenceNumber)
                .filter(Boolean); // Removes null/undefined values
        }

        return [];
    } catch (error) {
        console.error("Error fetching reference numbers:", error);
        return null;
    } finally {
        await apiContext.dispose();
    }
}