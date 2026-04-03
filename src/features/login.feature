@login
Feature: Login Functionality

  As a user of the application
  I want to be able to log in with valid credentials
  So that I can access the secure area of the application

  Background:
    Given I am on the login page

  # ─── Positive Scenario ─────────────────────────────────────

  @smoke @positive
  Scenario: Successful login with valid credentials
    When I enter username "tomsmith"
    And I enter password "SuperSecretPassword!"
    And I click the login button
    Then I should see the secure area
    And I should see a success flash message

  # ─── Negative Scenarios ────────────────────────────────────

  @negative
  Scenario: Login fails with invalid username
    When I enter username "invaliduser"
    And I enter password "SuperSecretPassword!"
    And I click the login button
    Then I should see an error flash message containing "Your username is invalid!"

  @negative
  Scenario: Login fails with invalid password
    When I enter username "tomsmith"
    And I enter password "WrongPassword"
    And I click the login button
    Then I should see an error flash message containing "Your password is invalid!"

  # ─── Scenario Outline (Data-Driven) ────────────────────────

  @data-driven @negative
  Scenario Outline: Login with various invalid credentials
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see an error flash message containing "<error_message>"

    Examples:
      | username    | password             | error_message              |
      | wronguser   | SuperSecretPassword! | Your username is invalid!  |
      | tomsmith    | wrongpass            | Your password is invalid!  |
      |             | SuperSecretPassword! | Your username is invalid!  |
      | tomsmith    |                      | Your password is invalid!  |

  # ─── Logout Scenario ───────────────────────────────────────

  @smoke @logout
  Scenario: User can logout after successful login
    When I enter username "tomsmith"
    And I enter password "SuperSecretPassword!"
    And I click the login button
    And I click the logout button
    Then I should be on the login page
