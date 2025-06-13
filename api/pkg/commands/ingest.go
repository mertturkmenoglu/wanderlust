package commands

import (
	"wanderlust/app/ingest"

	"github.com/spf13/cobra"
)

func CmdIngest() *cobra.Command {
	return &cobra.Command{
		Use:   "ingest",
		Short: "Ingest OSM data",
		Run: func(cmd *cobra.Command, args []string) {
			ingest.Ingest()
		},
	}
}
