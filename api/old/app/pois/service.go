package pois

func (s *service) publishDraft(id string) error {
	draft, err := s.getDraft(id)

	if err != nil {
		return err
	}

	err = s.repository.publishDraft(draft)

	if err != nil {
		return err
	}

	return s.deleteDraft(id)
}
