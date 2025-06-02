package commands

import (
	"log"
	"wanderlust/pkg/fake"

	"github.com/spf13/cobra"
)

func CmdFake() *cobra.Command {
	return &cobra.Command{
		Use:   "fake",
		Short: "Generate fake data",
		Run: func(cmd *cobra.Command, args []string) {
			err := fake.Automate()

			if err != nil {
				log.Fatal("Encountered error. Terminating", err)
			}
		},
	}
}
