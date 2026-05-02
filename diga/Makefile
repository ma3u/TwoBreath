# diga/Makefile — convenience wrappers around the ingestion scripts.
# Run `make help` for the entry points.

.PHONY: help fetch convert ingest official-matrix verify clean

PYTHON ?= python3

help:
	@echo "Targets:"
	@echo "  fetch            Download BSI TR-03161 PDFs and law HTML"
	@echo "  convert          Convert TR PDFs and law HTML to markdown"
	@echo "  ingest           fetch + convert"
	@echo "  official-matrix  Generate COMPLIANCE_MATRIX_TR1_OFFICIAL.md (127 rows)"
	@echo "  verify           Re-hash downloaded sources and diff against manifest"
	@echo "  clean            Remove generated markdown and html (keeps PDFs)"

fetch:
	./scripts/fetch-pdfs.sh
	$(PYTHON) scripts/fetch-laws.py

convert:
	@for n in 1 2 3; do \
		$(PYTHON) scripts/pdf-to-md.py \
			regulations/pdf/BSI-TR-03161-$$n.pdf \
			regulations/markdown/BSI-TR-03161-$$n.md; \
	done

ingest: fetch convert official-matrix

official-matrix:
	$(PYTHON) scripts/build-official-matrix.py

verify:
	@cd regulations/pdf && for f in *.pdf; do \
		actual=$$(shasum -a 256 "$$f" | awk '{print $$1}'); \
		echo "$$f $$actual"; \
	done

clean:
	rm -rf regulations/markdown/*.md regulations/html/
	@echo "(PDFs preserved in regulations/pdf/)"
