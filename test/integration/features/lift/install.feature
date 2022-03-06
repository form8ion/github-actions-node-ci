Feature: Dependency installation

  Scenario: legacy action in use
    Given a CI workflow exists
    And the legacy action is in use for installing dependencies
    When the project is lifted
    Then the legacy action is replaced with direct installation
