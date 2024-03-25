Feature: Engines matrix

  Scenario: No existing matrix, no engines defined
    Given a CI workflow exists
    When the project is lifted
    Then no matrix job is configured

  Scenario: No existing matrix, engines range defined
    Given a CI workflow exists
    And the nvmrc is referenced using the modern property "with" caching enabled
    And a greater-than-minimum node version range is defined
    When the project is lifted
    Then a matrix job is added
    And the matrix job uses "ubuntu-latest" as the runner

  Scenario: No existing matrix, engines range defined, custom runner
    Given a CI workflow exists
    And the project prefers to use the "foo" runner
    And the nvmrc is referenced using the modern property "with" caching enabled
    And a greater-than-minimum node version range is defined
    When the project is lifted
    Then a matrix job is added
    And the matrix job uses "foo" as the runner

  Scenario: Existing matrix, greater-than-minimum engines range defined
    Given a CI workflow exists
    And a greater-than-minimum node version range is defined
    And the node version is based on a matrix "with" caching enabled
    When the project is lifted
    Then the matrix job is updated

  Scenario: Existing matrix, multiple range engines definition
    Given a CI workflow exists
    And multiple node version ranges are defined
    And the node version is based on a matrix "with" caching enabled
    When the project is lifted
    Then the matrix job is updated

  Scenario: Existing matrix, no engines defined w/ caching
    Given a CI workflow exists
    And the node version is based on a matrix "with" caching enabled
    When the project is lifted
    Then the matrix job is unchanged
    And dependency caching is enabled

  Scenario: Existing matrix, no engines defined w/o caching
    Given a CI workflow exists
    And the node version is based on a matrix "without" caching enabled
    When the project is lifted
    Then dependency caching is enabled
