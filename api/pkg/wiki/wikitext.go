package wiki

import (
	"bytes"
	"fmt"
	"os/exec"
	"regexp"
)

var footnoteRegex = regexp.MustCompile(`\[\d+\]`)
var sectionRegex = regexp.MustCompile(`==.*?==`)

func ConvertWikiTextToPlainText(wikitext string) (string, error) {
	cmd := exec.Command(
		"docker", "run",
		"--rm", "-i",
		"pandoc/extra",
		"-f", "mediawiki",
		"-t", "plain",
	)

	var inBuf, outBuf, errBuf bytes.Buffer
	inBuf.WriteString(wikitext)

	cmd.Stdin = &inBuf
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	err := cmd.Run()
	if err != nil {
		return "", fmt.Errorf("error running Pandoc: %v, stderr: %s", err, errBuf.String())
	}

	return outBuf.String(), nil
}

func RemoveFootnotes(text string) string {
	return footnoteRegex.ReplaceAllString(text, "")
}

func GetWikiTextFirstSection(wikitext string) (string, error) {
	match := sectionRegex.FindStringIndex(wikitext)

	if match != nil {
		return wikitext[:match[0]], nil
	}

	return "", fmt.Errorf("no section delimiter found in wikitext")
}
