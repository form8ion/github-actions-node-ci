Feature: Node Version

  Scenario: modern use of nvmrc file
    Given a CI workflow exists
    And the nvmrc is referenced using the modern property
    When the project is lifted
    Then the ci config remains unchanged

  Scenario: legacy determination of version for nvmrc file
    Given a CI workflow exists
    And the version is read from the nvmrc and passed as a value to the setup-node step
    When the project is lifted
    Then the setup-node step is updated to reference the nvmrc file using the modern property

  Scenario: node version based on matrix
    Given a CI workflow exists
    And the node version is based on a matrix
    When the project is lifted
    Then the ci config remains unchanged
