# Paper Restructure Plan

Target: reduce `~/Downloads/Codemode_MDPI_Paper__Copy_.pdf` from **13 pages** to **7 pages** without losing the core benchmark contribution.

## Recommended 7-Page Shape

1. Abstract
2. Introduction
3. Implementation
4. Results
5. Discussion and Conclusion
6. Appendix A: Detailed scenario tables
7. Appendix B: Expanded observability/failure tables

## Cuts and Merges

### 1. Merge Section 2 into Section 1

- Merge **Section 2: Related Work** into the end of **Section 1: Introduction**.
- Keep only a compact three-paragraph related-work synthesis:
  - agent benchmarks
  - tool-use / function-calling literature
  - code-based orchestration and sandbox execution
- Keep citations, but remove subsection headers `2.1`, `2.2`, `2.3`.
- Expected savings: about **1 page**.

### 2. Collapse Sections 3.4 to 3.6 into one Implementation section

- Current structure:
  - `3.4. Architectural Comparison: Function Calling versus Code Mode`
  - `3.5. MCP Compatibility and Tool Exposure Strategy`
  - `3.6. Implementation Internals`
- Replace with one section:
  - **3.4. Implementation**
- Keep only:
  - one short paragraph defining the two paradigms
  - one paragraph on MCP compatibility and why MCP is complementary rather than competitive
  - one concise paragraph on sandbox internals, tool exposure, and observability
- Move low-level executor details and exhaustive tool-exposure explanations to appendix or repository documentation.
- Expected savings: **1.5 to 2 pages**.

### 3. Compress Section 3 overall

- Keep `3.1 Base Implementation`, `3.2 System Overview`, `3.3 Provider Routing and Methodological Neutrality` only if each is cut to a short paragraph.
- Fold `3.7 The Role of the Harness`, `3.8 Reproducibility Protocol`, and `3.9 Evaluation Metrics` into:
  - one reproducibility paragraph
  - one evaluation paragraph
- Replace prose lists with one compact summary table if needed.
- Expected savings: **1 page**.

### 4. Move detailed tables out of Section 4

- Keep only one aggregate results table in the main body:
  - model-level aggregate outcomes
  - one compact efficiency comparison
- Move:
  - scenario-level detailed tables
  - expanded latency/token tables
  - long failure breakdowns
  - per-model case tables
  into appendix.
- In main text, summarize trends in prose and cite appendix tables.
- Expected savings: **2 pages**.

### 5. Remove the statistical caveat paragraph

- The paragraph near **Section 3.9 / 4 transition** that says results are indicative rather than statistically definitive should be reduced to one sentence in Limitations.
- Keep the limitation, cut the paragraph-level discussion.
- Expected savings: **0.25 page**.

### 6. Merge Discussion and Conclusion

- Combine:
  - `5. Discussion`
  - `6. Limitations and Future Work`
  - `7. Conclusions`
- New structure:
  - **5. Discussion and Conclusion**
  - short subsections only if necessary:
    - `5.1 Practical Implications`
    - `5.2 Limitations`
    - `5.3 Conclusion`
- Remove repeated statements about code mode efficiency that already appear in Results.
- Expected savings: **1 to 1.5 pages**.

## What to Keep in Main Text

- Problem framing around constrained agentic workflows.
- Clear definition of the two orchestration paradigms.
- One compact implementation overview.
- One aggregate results table.
- One figure or compact table for cost/token efficiency.
- One short failure-analysis paragraph.
- One short conclusion tying results back to deployment guidance.

## What to Move to Appendix

- Detailed scenario-by-scenario tables.
- Expanded model case studies.
- Full observability/failure taxonomies.
- Harness internals and sandbox implementation details.
- Long tool-exposure and MCP discussion.
- Reproducibility command details that already live in the repository.

## Concrete Edit Order

1. Rewrite Introduction to absorb the essential Related Work citations.
2. Replace Sections `3.4` to `3.6` with one compressed Implementation subsection.
3. Trim `3.7` to `3.9` into a short reproducibility-and-metrics block.
4. Reduce Results to one aggregate table plus one compact comparative table.
5. Move detailed tables to appendix and replace them with one-sentence references.
6. Merge Discussion, Limitations, and Conclusion into one final section.

## Expected Outcome

- Related Work merge: **~1.0 page**
- Methods compression: **~2.5 to 3.0 pages**
- Table migration: **~2.0 pages**
- Discussion/Conclusion merge and caveat cut: **~1.0 to 1.5 pages**

Total expected reduction: **6 to 7.5 pages**, which is enough to bring the paper down to **about 7 pages**.
