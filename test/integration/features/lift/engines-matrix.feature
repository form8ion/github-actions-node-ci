Feature: Engines matrix

  Scenario: No existing matrix, no engines defined
    Given a CI workflow exists
    When the project is lifted
    Then no matrix job is configured

  @wip
  Scenario: No existing matrix, engines range defined
    Given a CI workflow exists
    And a greater-than-minimum node version range is defined
    When the project is lifted
    Then a matrix job is added

  Scenario: Existing matrix, engines range defined
    Given a CI workflow exists
    And a greater-than-minimum node version range is defined
    And the node version is based on a matrix
    When the project is lifted
    Then the matrix job is updated

  Scenario: Existing matrix, no engines defined
    Given a CI workflow exists
    And the node version is based on a matrix
    When the project is lifted
    Then the matrix job is unchanged
