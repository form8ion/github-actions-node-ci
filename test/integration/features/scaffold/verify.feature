Feature: Verify Workflow

  Scenario: new project
    When the project is scaffolded
    Then the verification workflow is created
    And the jobs use "ubuntu-latest" as the runners
    And the status badge is returned

  Scenario: new project with specific runner preference
    Given the project prefers to use the "foo" runner
    When the project is scaffolded
    Then the verification workflow is created
    And the jobs use "foo" as the runners
