Feature: Lift

  Scenario: No Additional Branches
    Given a CI workflow exists
    And no additional branches are defined
    When the project is lifted
    Then the ci config remains unchanged
    And empty results are returned

  Scenario: New Additional Branches
    Given a CI workflow exists
    And additional branches are provided
    When the project is lifted
    Then the branches are added to the ci config
    And empty results are returned

  Scenario: Existing Additional Branches
    Given a CI workflow exists
    And existing branches are provided as additional branches
    When the project is lifted
    Then the ci config remains unchanged
    And empty results are returned

  Scenario: No Existing Config
    When the project is lifted
