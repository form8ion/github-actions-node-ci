Feature: Lift

  Scenario: No Additional Branches
    Given no additional branches are defined
    When the project is lifted
    Then the ci config remains unchanged

  Scenario: New Additional Branches
    Given additional branches are provided
    When the project is lifted
    Then the branches are added to the ci config

  Scenario: Existing Additional Branches
    Given existing branches are provided as additional branches
    When the project is lifted
    Then the ci config remains unchanged
