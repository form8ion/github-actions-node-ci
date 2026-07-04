Feature: Verify Workflow

  Scenario: new project
    Given the workflows directory exists
    When the project is scaffolded
    Then the verification workflow is created
    And the jobs use "ubuntu-latest" as the runners
    And the status badge is returned

  Scenario: new project without github workflows
    Given the workflows directory does not exist
    When the project is scaffolded
    Then the verification workflow is not created

  Scenario: new project with specific runner preference
    Given the workflows directory exists
    And the project prefers to use the "foo" runner
    When the project is scaffolded
    Then the verification workflow is created
    And the jobs use "foo" as the runners
