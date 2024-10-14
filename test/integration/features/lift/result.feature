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

  @wip
  Scenario: No existing result job, existing verify and verify-matrix
    Given a CI workflow exists
    And a "verify" job exists
    And a "verify-matrix" job exists
    When the project is lifted
    Then the workflow-result job exists
    And the workflow-result job depends on "verify"
    And the workflow-result job depends on "verify-matrix"
