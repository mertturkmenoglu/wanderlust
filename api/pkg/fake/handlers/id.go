package handlers

import "os/exec"

type FakeID struct {
}

func (f *FakeID) Generate() (int64, error) {
	return 0, exec.Command("just", "fake-id").Run()
}
