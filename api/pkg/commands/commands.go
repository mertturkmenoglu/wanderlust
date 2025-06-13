package commands

import "github.com/spf13/cobra"

var Commands = []*cobra.Command{
	CmdFake(),
	CmdSearchSync(),
	CmdIngest(),
}
