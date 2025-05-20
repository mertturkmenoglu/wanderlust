package db

// Check this URL for more information about PostgreSQL error codes:
// https://www.postgresql.org/docs/11/errcodes-appendix.html

// Class 23 — Integrity Constraint Violation
const (
	INTEGRITY_CONSTRAINT_VIOLATION = "23000"
	RESTRICT_VIOLATION             = "23001"
	NOT_NULL_VIOLATION             = "23502"
	FOREIGN_KEY_VIOLATION          = "23503"
	UNIQUE_VIOLATION               = "23505"
	CHECK_VIOLATION                = "23514"
	EXCLUSION_VIOLATION            = "23P01"
)
