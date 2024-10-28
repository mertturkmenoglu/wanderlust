# Contributing to Wanderlust <!-- omit in toc -->

Thank you for investing your time in contributing to Wanderlust!

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

Use the table of contents icon on the top left corner of this document to get to a specific section of this guide quickly.

## New contributor guide

To get an overview of the project, read the [README](README.md) file. You will find:

- What dependencies do you need
- How to setup your system to run Wanderlust locally
- How to fill environment variables and download some necessary files.

After that, you can find documentation files inside each subproject.

## Getting started

First, you must read the [README](README.md) file in the root directory. It will help you understand what you need to do for getting started with the project.

Then, you can navigate to different subproject folders. There are 3 different applications inside Wanderlust repository:

- `api`: A RESTful Go + Echo web server.
- `web`: A Remix app serving web application.
- `wiop`: An on-the-fly image optimization proxy to serve media.

Each folder includes a README file that will guide you how to setup that project and run. You can follow from there.

### Issues

#### Create a new issue

If you spot a problem with the application, please first search for an issue. If there's a related open issue you can join the conversation and help us.

If you cannot find a related open issue, please open a new issue and give details as much as possible.

#### Solve an issue

If you want to help solve some issues, scan our open issues and choose something you want to work. You are very welcome to open a PR with a fix.

### Make Changes

#### Make changes locally

1. Fork the repository.

- Using GitHub Desktop:

  - [Getting started with GitHub Desktop](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/getting-started-with-github-desktop) will guide you through setting up Desktop.
  - Once Desktop is set up, you can use it to [fork the repo](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/cloning-and-forking-repositories-from-github-desktop)!

- Using the command line:
  - [Fork the repo](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository) so that you can make your changes without affecting the original project until you're ready to merge them.

2. Install the prerequirements specified in the [README](README.md) file within the specified version range.

3. Create a working branch (e.g: fix/login-bug) and start with your changes!

### Commit your update

Commit the changes once you are happy with them. Don't forget to use the "[Self review checklist](https://docs.github.com/en/contributing/collaborating-on-github-docs/self-review-checklist) to speed up the review process :zap:.

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

- Fill the "Ready for review" template so that we can review your PR. This template helps reviewers understand your changes as well as the purpose of your pull request.
- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a Docs team member will review your proposal. We may ask questions or request additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

### Your PR is merged!

Congratulations :tada::tada: The Wanderlust team thanks you :sparkles:.

Once your PR is merged, your contributions will be publicly visible on the repository.

We will also update the contributors file and include your name as a thank you.
