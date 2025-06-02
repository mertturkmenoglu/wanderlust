package commands

import (
	"log"
	"wanderlust/pkg/search"

	"github.com/spf13/cobra"
)

func CmdSearchSync() *cobra.Command {
	return &cobra.Command{
		Use:   "search-sync",
		Short: "Sync search index",
		Run: func(cmd *cobra.Command, args []string) {
			err := search.Sync()

			if err != nil {
				log.Fatal("Encountered error. Terminating", err)
			}
		},
	}
}
