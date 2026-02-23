Feature: B.tech Assignment

  @AddToCart
  Scenario Outline: Add Iphone 16
    Given Navigate to B.tech System in "<language>"
    When User Searches for "searchItem" from "<jsonObject>"
    Then User Asserts That the "searchItem" from "<jsonObject>" is Displayed with image
    And User Adds First "searchItem" to Cart from "<jsonObject>"
    And User Clicks on "Cart" Text
    Then User Asserts That the "searchItem" from "<jsonObject>" is Displayed in Cart Page with image

    @English
    Examples:
      | language         | jsonObject |
      | <prime_language> | search     |

    @Arabic
    Examples:
      | language             |jsonObject|
      | <secondary_language> |search     |