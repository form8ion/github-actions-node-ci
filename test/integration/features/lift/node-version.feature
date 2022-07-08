Feature: Node Version

  Scenario: modern use of nvmrc file w/ caching
    Given a CI workflow exists
    And the nvmrc is referenced using the modern property "with" caching enabled
    When the project is lifted
    Then the ci config remains unchanged
    And dependency caching is enabled

  Scenario: modern use of nvmrc file w/o caching
    Given a CI workflow exists
    And the nvmrc is referenced using the modern property "without" caching enabled
    When the project is lifted
    Then dependency caching is enabled

  Scenario: legacy determination of version for nvmrc file
    Given a CI workflow exists
    And the version is read from the nvmrc and passed as a value to the setup-node step
    When the project is lifted
    Then the setup-node step is updated to reference the nvmrc file using the modern property

  Scenario: node version based on matrix
    Given a CI workflow exists
    And the node version is based on a matrix "with" caching enabled
    When the project is lifted
    Then the ci config remains unchanged

  Scenario: node version is defined as a static range
    Given a CI workflow exists
    And the version is defined statically
    When the project is lifted
    Then the setup-node step is updated to reference the nvmrc file using the modern property
    And dependency caching is enabled
