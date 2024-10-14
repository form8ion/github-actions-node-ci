Feature: Overall Workflow Result

  Scenario: Existing result job
    Given a CI workflow exists
    And a "workflow-result" job exists
    When the project is lifted
    Then the workflow-result job exists
    And the "workflow-result" job is unchanged

  Scenario: No existing result job, existing verify
    Given a CI workflow exists
    And a "verify" job exists
    When the project is lifted
    Then the workflow-result job exists
    And the workflow-result job depends on "verify"
    And the workflow-result job uses "ubuntu-latest" as the runner

  Scenario: custom runner
    Given a CI workflow exists
    And a "verify" job exists
    And the project prefers to use the "foo" runner
    When the project is lifted
    Then the workflow-result job uses "foo" as the runner

  @wip
  Scenario: No existing result job, existing verify and verify-matrix
    Given a CI workflow exists
    And a "verify" job exists
    And a "verify-matrix" job exists
    When the project is lifted
    Then the workflow-result job exists
    And the workflow-result job depends on "verify"
    And the workflow-result job depends on "verify-matrix"
