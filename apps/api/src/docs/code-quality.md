# Code Quality

- We are using a few tools to check the code quality and vulnerabilities:
  - gosec
  - staticcheck
  - go vet

## Installing Tools

- gosec `https://github.com/securego/gosec`
- staticcheck `https://staticcheck.dev/docs/getting-started/`
- go vet is built into Go

## Running Tools

- You can use Justfile commands to run the tools:

  - `just gosec`
  - `just staticcheck`
  - `just vet`

- gosec produces a report in HTML format and opens it in the browser.
- Other tools produce reports and show them in the terminal.
