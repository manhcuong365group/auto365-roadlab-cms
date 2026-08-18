import Link from "next/link";
import type { ArticleViewModel } from "../../../lib/case-article-view";
import { serializeJsonLd } from "../../../lib/case-lab";

const HOTLINE_DISPLAY = "0365 365 911";
const HOTLINE_HREF = "tel:0365365911";

function initials(text: string): string {
  return (text.trim()[0] ?? "A").toUpperCase();
}

type ArticleProps = {
  vm: ArticleViewModel;
  contentTypeLabel: string;
  caseCode: string;
  branchRef: string;
  publishedDisplay: string;
};

function SiteHeader() {
  return (
    <header className="case-header">
      <Link className="case-brand" href="/">
        <span className="case-brand-mark">A365</span>
        <span className="case-brand-copy">
          <strong>Auto365.vn</strong>
          <small>CASE LAB</small>
        </span>
      </Link>
      <nav>
        <Link href="/">Trang chủ</Link>
      </nav>
      <a className="case-header-cta" href={HOTLINE_HREF}>Gọi tư vấn</a>
    </header>
  );
}

function FinalCta() {
  return (
    <section className="case-final-cta">
      <div>
        <span className="case-kicker case-kicker--light">AUTO365.VN</span>
        <h2>Cần tư vấn giải pháp tương tự?</h2>
        <p>Liên hệ Auto365.vn để được tư vấn theo đúng nhu cầu và ca xe của bạn.</p>
        <div>
          <a href={HOTLINE_HREF}>{HOTLINE_DISPLAY}</a>
          <Link href="/">Về trang chủ</Link>
        </div>
      </div>
    </section>
  );
}

/** Long-tail sections shared by the non-road_lab layouts: same data, single-column, no rail. */
function TailSections({ vm, skipMetrics }: { vm: ArticleViewModel; skipMetrics?: boolean }) {
  return <>
    {!skipMetrics && vm.metrics.length ? (
      <section className="case-content-section" id="metrics">
        <div className="case-section-heading"><div><h2>Thông số sản phẩm</h2></div></div>
        <div className="case-metric-grid">
          {vm.metrics.map((item, index) => (
            <div key={index}><span>{item.label}</span><b>{item.value}</b>{item.note ? <small>{item.note}</small> : null}</div>
          ))}
        </div>
      </section>
    ) : null}

    {vm.evidenceImages.length ? (
      <section className="case-content-section" id="evidence">
        <div className="case-section-heading"><div><span className="case-section-no">•</span><h2>Bằng chứng</h2></div></div>
        <div className="case-photo-story">
          {vm.evidenceImages.map((url, index) => (
            <figure key={url} className={index === 0 ? "case-photo-story__large" : undefined}>
              <img src={url} alt={`${vm.title} — bằng chứng ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
        {vm.sourceNote ? <p className="case-source-note">{vm.sourceNote}</p> : null}
      </section>
    ) : null}

    {vm.beamCosUrl || vm.beamPhaUrl ? (
      <section className="case-content-section" id="beams">
        <div className="case-section-heading"><div><h2>Vùng sáng Cos/Pha</h2></div></div>
        <div className="case-beam-grid">
          {vm.beamCosUrl ? (
            <figure><div><span>COS</span><b>Chế độ chiếu gần</b></div><img src={vm.beamCosUrl} alt={`Vùng sáng Cos — ${vm.title}`} />{vm.beamCosCaption ? <figcaption>{vm.beamCosCaption}</figcaption> : null}</figure>
          ) : null}
          {vm.beamPhaUrl ? (
            <figure><div><span>PHA</span><b>Chế độ chiếu xa</b></div><img src={vm.beamPhaUrl} alt={`Vùng sáng Pha — ${vm.title}`} />{vm.beamPhaCaption ? <figcaption>{vm.beamPhaCaption}</figcaption> : null}</figure>
          ) : null}
        </div>
      </section>
    ) : null}

    {vm.timelineSteps.length ? (
      <section className="case-content-section" id="timeline">
        <div className="case-section-heading"><div><span className="case-section-no">•</span><h2>Timeline thực hiện</h2></div></div>
        <ol className="case-timeline">
          {vm.timelineSteps.map((step, index) => (
            <li key={index}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{step.title}</b>{step.text ? <p>{step.text}</p> : null}</div></li>
          ))}
        </ol>
      </section>
    ) : null}

    {vm.known.length || vm.unknown.length ? (
      <section className="case-ledger-section" id="ledger">
        <div className="case-section-heading"><div><h2>Đã biết / Chưa biết</h2></div></div>
        <div className="case-ledger-grid">
          <div className="case-ledger case-ledger--yes"><h3><span>✓</span>Đã xác nhận</h3><ul>{vm.known.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
          <div className="case-ledger case-ledger--unknown"><h3><span>?</span>Chưa xác nhận</h3><ul>{vm.unknown.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
        </div>
      </section>
    ) : null}

    {vm.qcItems.length ? (
      <section className="case-content-section" id="qc">
        <div className="case-section-heading"><div><h2>Kiểm tra chất lượng</h2></div></div>
        <div className="case-qc-card">
          <div className="case-qc-head"><span><i />ĐÃ NGHIỆM THU</span><b>{vm.qcItems.length} hạng mục đã kiểm tra</b></div>
          <div className="case-qc-grid">
            {vm.qcItems.map((item, index) => (
              <div key={index}><span>✓</span><div><small>{item.label}</small><b>{item.result}</b></div></div>
            ))}
          </div>
        </div>
      </section>
    ) : null}

    {vm.priceValue ? (
      <section className="case-price-section" id="price">
        <div>
          <span className="case-kicker case-kicker--light">GIÁ THAM KHẢO</span>
          <h2>{vm.priceValue}</h2>
          {vm.priceNote ? <p>{vm.priceNote}</p> : null}
        </div>
        <dl>{vm.priceIncludes.map((item, index) => <div key={index} className="known"><dt>{String(index + 1).padStart(2, "0")}</dt><dd>{item}</dd></div>)}</dl>
      </section>
    ) : null}

    {vm.faqs.length ? (
      <section className="case-faq-section" id="faq">
        <div className="case-section-heading"><div><h2>Hỏi đáp</h2></div></div>
        <div>{vm.faqs.map((item, index) => <details key={index}><summary><span>{String(index + 1).padStart(2, "0")}</span>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>
    ) : null}

    {vm.reviewerName || vm.primarySource ? (
      <section className="case-author-section">
        <div className="case-author-person">
          <span className="case-avatar case-avatar--large">{initials(vm.authorName)}</span>
          <div><span>TÁC GIẢ</span><h3>{vm.authorName}</h3><p>{vm.authorRole}</p></div>
        </div>
        {vm.reviewerName ? (
          <div className="case-author-person">
            <span className="case-avatar case-avatar--large">{initials(vm.reviewerName)}</span>
            <div><span>NGƯỜI RÀ SOÁT</span><h3>{vm.reviewerName}</h3><p>{vm.reviewerRole}</p></div>
          </div>
        ) : null}
        {vm.primarySource ? <div className="case-editorial-policy"><span>NGUỒN CHÍNH</span><p>{vm.primarySource}</p></div> : null}
      </section>
    ) : null}

    {vm.followupSteps.length ? (
      <section className="case-followup-section" id="followup">
        <div className="case-section-heading"><div><h2>Theo dõi hậu kiểm</h2></div></div>
        <div className="case-followup-track">
          {vm.followupSteps.map((step, index) => <div key={index} className={step.done ? "done" : undefined}><b>{step.date || `MỐC ${index + 1}`}</b><span>{step.label}</span></div>)}
        </div>
      </section>
    ) : null}

    {vm.relatedLinks.length ? (
      <section className="case-content-section" id="related">
        <div className="case-section-heading"><div><h2>Bài liên quan</h2></div></div>
        <div className="case-cluster-links">
          {vm.relatedLinks.map((link, index) => <a key={index} href={link.url}><span>ĐỌC THÊM</span><b>{link.label}</b><span>→</span></a>)}
        </div>
      </section>
    ) : null}
  </>;
}

/** road_lab — long-form editorial magazine layout: photo hero, stat strip, sticky TOC rail. */
function RoadLabArticle({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay }: ArticleProps) {
  return (
    <div className="case-page case-page--road_lab">
      <SiteHeader />
      <section className="case-hero">
        <div className="case-hero-media">
          {vm.heroUrl ? <img src={vm.heroUrl} alt={vm.title} /> : null}
          <div className="case-hero-scrim" />
        </div>
        <div className="case-shell case-hero-content">
          <p className="case-breadcrumb"><b>Auto365</b> <span>/</span> {contentTypeLabel} <span>/</span> {caseCode}</p>
          <div className="case-eyebrow-row">
            <span className="case-tag case-tag--red">{contentTypeLabel.toUpperCase()}</span>
            <span className="case-tag">{branchRef}</span>
          </div>
          <h1>{vm.title}</h1>
          {vm.summary ? <p className="case-dek">{vm.summary}</p> : null}
          <div className="case-byline">
            <span className="case-avatar">{initials(vm.authorName)}</span>
            <p><strong>{vm.authorName}</strong><br />{vm.authorRole}</p>
            <div className="case-date-block"><span>Xuất bản</span><span>{publishedDisplay}</span></div>
          </div>
        </div>
      </section>

      <section className="case-fact-strip">
        <div className="case-shell case-fact-grid">
          {vm.facts.map((fact) => <div key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong>{fact.note ? <small>{fact.note}</small> : null}</div>)}
        </div>
      </section>

      <div className="case-shell case-article-shell">
        <aside className="case-rail">
          <p>Trong bài này</p>
          <ol>
            <li><a href="#answer">Kết luận nhanh</a></li>
            <li><a href="#profile">{vm.profileHeading}</a></li>
            <li><a href="#editorial">{vm.editorialHeading}</a></li>
            <li><a href="#method">{vm.methodHeading}</a></li>
            {vm.metrics.length ? <li><a href="#metrics">Thông số sản phẩm</a></li> : null}
            {vm.evidenceImages.length ? <li><a href="#evidence">Bằng chứng</a></li> : null}
            {vm.beamCosUrl || vm.beamPhaUrl ? <li><a href="#beams">Vùng sáng Cos/Pha</a></li> : null}
            {vm.timelineSteps.length ? <li><a href="#timeline">Timeline</a></li> : null}
            {vm.known.length || vm.unknown.length ? <li><a href="#ledger">Đã biết / Chưa biết</a></li> : null}
            {vm.qcItems.length ? <li><a href="#qc">Kiểm tra chất lượng</a></li> : null}
            {vm.priceValue ? <li><a href="#price">Giá tham khảo</a></li> : null}
            {vm.faqs.length ? <li><a href="#faq">Hỏi đáp</a></li> : null}
            {vm.followupSteps.length ? <li><a href="#followup">Theo dõi hậu kiểm</a></li> : null}
            {vm.relatedLinks.length ? <li><a href="#related">Bài liên quan</a></li> : null}
          </ol>
          <div className="case-rail-contact">
            <span>CẦN TƯ VẤN?</span>
            <strong>{HOTLINE_DISPLAY}</strong>
            <small>Auto365.vn hỗ trợ trực tiếp theo chi nhánh {branchRef}.</small>
            <a href={HOTLINE_HREF}>Gọi ngay</a>
          </div>
        </aside>

        <main className="case-article-body">
          {vm.answerFirst ? (
            <article className="case-answer-card" id="answer">
              <span className="case-kicker">KẾT LUẬN NHANH</span>
              <h2>Answer First</h2>
              <p>{vm.answerFirst}</p>
            </article>
          ) : null}

          <section className="case-passport" id="profile">
            <div className="case-passport-head">
              <span className="case-kicker">01</span>
              <h2>{vm.profileHeading}</h2>
              <p>{vm.profileLead}</p>
            </div>
            <div className="case-passport-grid">
              <dl>{vm.profileEntries.map((entry) => <div key={entry.label}><dt>{entry.label}</dt><dd>{entry.value}</dd></div>)}</dl>
            </div>
          </section>

          <section className="case-content-section" id="editorial">
            <div className="case-section-heading"><div><span className="case-section-no">02</span><h2>{vm.editorialHeading}</h2></div></div>
            <p className="case-section-lead">{vm.editorialLead}</p>
            <div className="case-editorial-split">
              <div>
                {vm.editorialParagraphs.length ? vm.editorialParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>Chưa cập nhật nội dung chi tiết.</p>}
                <div className="case-editorial-note"><span>{vm.editorialNoteLabel}</span><p>{vm.editorialNoteText}</p></div>
              </div>
            </div>
          </section>

          <section className="case-content-section" id="method">
            <div className="case-method-card">
              <div><span className="case-kicker">03</span><h3>{vm.methodHeading}</h3><p>{vm.methodLead}</p></div>
              <dl>{vm.methodEntries.map((entry) => <div key={entry.label}><dt>{entry.label}</dt><dd>{entry.value}</dd></div>)}</dl>
            </div>
          </section>

          <TailSections vm={vm} />
        </main>
      </div>

      <FinalCta />
    </div>
  );
}

/** proof_lab — inspection / lab-report layout: letterhead header, verdict stamp, before/after as the centerpiece, no sidebar. */
function ProofLabArticle({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay }: ArticleProps) {
  return (
    <div className="case-page case-page--proof_lab">
      <SiteHeader />
      <section className="proof-letterhead">
        <div className="case-shell proof-letterhead-inner">
          <p className="case-breadcrumb"><b>Auto365</b> <span>/</span> {contentTypeLabel} <span>/</span> {caseCode}</p>
          <div className="proof-letterhead-row">
            <div>
              <div className="case-eyebrow-row">
                <span className="case-tag case-tag--red">{contentTypeLabel.toUpperCase()}</span>
                <span className="case-tag">{branchRef}</span>
              </div>
              <h1>{vm.title}</h1>
              {vm.summary ? <p className="case-dek">{vm.summary}</p> : null}
            </div>
            <div className="proof-verdict-stamp">
              <span>ĐÃ NGHIỆM THU</span>
              <strong>{publishedDisplay}</strong>
            </div>
          </div>
          <div className="proof-meta-row">
            {vm.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
          </div>
        </div>
      </section>

      <div className="case-shell proof-body">
        {vm.answerFirst ? (
          <article className="case-answer-card case-answer-card--verdict" id="answer">
            <span className="case-verdict-badge">KẾT LUẬN</span>
            <span className="case-kicker">KẾT LUẬN NHANH</span>
            <h2>Kết quả nghiệm thu</h2>
            <p>{vm.answerFirst}</p>
          </article>
        ) : null}

        <section className="proof-compare-section" id="method">
          <div className="case-section-heading"><div><span className="case-section-no">01</span><h2>{vm.methodHeading}</h2></div></div>
          <p className="case-section-lead">{vm.methodLead}</p>
          {vm.methodEntries.length === 2 ? (
            <div className="case-compare-grid proof-compare-grid">
              <div className="case-compare-panel case-compare-panel--before"><span>{vm.methodEntries[0].label}</span><p>{vm.methodEntries[0].value}</p></div>
              <div className="case-compare-arrow" aria-hidden="true">→</div>
              <div className="case-compare-panel case-compare-panel--after"><span>{vm.methodEntries[1].label}</span><p>{vm.methodEntries[1].value}</p></div>
            </div>
          ) : (
            <dl className="proof-plain-dl">{vm.methodEntries.map((entry) => <div key={entry.label}><dt>{entry.label}</dt><dd>{entry.value}</dd></div>)}</dl>
          )}
        </section>

        <section className="proof-report-block" id="profile">
          <div className="case-section-heading"><div><span className="case-section-no">02</span><h2>{vm.profileHeading}</h2></div></div>
          <p className="case-section-lead">{vm.profileLead}</p>
          <dl className="proof-plain-dl">{vm.profileEntries.map((entry) => <div key={entry.label}><dt>{entry.label}</dt><dd>{entry.value}</dd></div>)}</dl>
        </section>

        <section className="case-content-section" id="editorial">
          <div className="case-section-heading"><div><span className="case-section-no">03</span><h2>{vm.editorialHeading}</h2></div></div>
          <p className="case-section-lead">{vm.editorialLead}</p>
          {vm.editorialParagraphs.length ? vm.editorialParagraphs.map((paragraph, index) => <p key={index} className="proof-paragraph">{paragraph}</p>) : <p className="proof-paragraph">Chưa cập nhật nội dung chi tiết.</p>}
          <div className="case-editorial-note"><span>{vm.editorialNoteLabel}</span><p>{vm.editorialNoteText}</p></div>
        </section>

        <TailSections vm={vm} />
      </div>

      <FinalCta />
    </div>
  );
}

/** brand_story — manifesto layout: full-bleed quote hero, single centered narrative column, no sidebar. */
function BrandStoryArticle({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay }: ArticleProps) {
  return (
    <div className="case-page case-page--brand_story">
      <SiteHeader />
      <section className="brand-hero">
        {vm.heroUrl ? <div className="brand-hero-media"><img src={vm.heroUrl} alt={vm.title} /><div className="case-hero-scrim" /></div> : null}
        <div className="case-shell brand-hero-content">
          <p className="case-breadcrumb"><b>Auto365</b> <span>/</span> {contentTypeLabel} <span>/</span> {caseCode}</p>
          <div className="case-eyebrow-row"><span className="case-tag case-tag--red">{contentTypeLabel.toUpperCase()}</span><span className="case-tag">{branchRef}</span></div>
          <h1 className="brand-hero-title">{vm.title}</h1>
          {vm.answerFirst ? <p className="brand-hero-quote">“{vm.answerFirst}”</p> : null}
          <div className="case-byline">
            <span className="case-avatar">{initials(vm.authorName)}</span>
            <p><strong>{vm.authorName}</strong><br />{vm.authorRole}</p>
            <div className="case-date-block"><span>Xuất bản</span><span>{publishedDisplay}</span></div>
          </div>
        </div>
      </section>

      <div className="case-shell brand-body">
        {vm.summary ? <p className="brand-lede">{vm.summary}</p> : null}

        <section className="brand-pillar" id="profile">
          <span className="case-kicker">ĐỊNH VỊ</span>
          <h2>{vm.profileHeading}</h2>
          <p className="brand-pillar-lead">{vm.profileLead}</p>
          <div className="brand-pillar-list">{vm.profileEntries.map((entry) => <div key={entry.label}><dt>{entry.label}</dt><dd>{entry.value}</dd></div>)}</div>
        </section>

        <section className="brand-pillar" id="editorial">
          <span className="case-kicker">THÔNG ĐIỆP</span>
          <h2>{vm.editorialHeading}</h2>
          <ol className="brand-message-list">
            {vm.editorialParagraphs.length ? vm.editorialParagraphs.map((paragraph, index) => <li key={index}><span>{String(index + 1).padStart(2, "0")}</span><p>{paragraph}</p></li>) : <li><span>01</span><p>Chưa cập nhật nội dung chi tiết.</p></li>}
          </ol>
          <div className="case-editorial-note"><span>{vm.editorialNoteLabel}</span><p>{vm.editorialNoteText}</p></div>
        </section>

        <section className="brand-testimonial" id="method">
          <span className="case-kicker">{vm.methodHeading.toUpperCase()}</span>
          <p className="brand-testimonial-lead">{vm.methodLead}</p>
          <div className="brand-testimonial-grid">
            {vm.methodEntries.map((entry) => <div key={entry.label}><b>{entry.label}</b><p>{entry.value}</p></div>)}
          </div>
        </section>

        <TailSections vm={vm} />
      </div>

      <FinalCta />
    </div>
  );
}

/** product_spotlight — commerce PDP layout: two-column gallery + sticky buy box, spec table, comparison table. */
function ProductSpotlightArticle({ vm, contentTypeLabel, caseCode, branchRef, publishedDisplay }: ArticleProps) {
  const gallery = vm.heroUrl ? [vm.heroUrl, ...vm.evidenceImages] : vm.evidenceImages;
  return (
    <div className="case-page case-page--product_spotlight">
      <SiteHeader />
      <div className="case-shell product-hero">
        <div className="product-gallery">
          {gallery.length ? (
            <>
              <figure className="product-gallery-main"><img src={gallery[0]} alt={vm.title} /></figure>
              {gallery.length > 1 ? (
                <div className="product-gallery-thumbs">{gallery.slice(1, 5).map((url, index) => <img key={url} src={url} alt={`${vm.title} — ảnh ${index + 2}`} loading="lazy" />)}</div>
              ) : null}
            </>
          ) : <div className="product-gallery-empty" />}
        </div>
        <div className="product-buybox">
          <p className="case-breadcrumb"><b>Auto365</b> <span>/</span> {contentTypeLabel} <span>/</span> {caseCode}</p>
          <div className="case-eyebrow-row"><span className="case-tag case-tag--red">{contentTypeLabel.toUpperCase()}</span><span className="case-tag">{branchRef}</span></div>
          <h1 className="product-title">{vm.title}</h1>
          {vm.summary ? <p className="product-summary">{vm.summary}</p> : null}
          <ul className="product-spec-bullets">{vm.facts.map((fact) => <li key={fact.label}><span>{fact.label}</span><b>{fact.value}</b></li>)}</ul>
          {vm.priceValue ? (
            <div className="product-price-card">
              <span>GIÁ THAM KHẢO</span>
              <strong>{vm.priceValue}</strong>
              {vm.priceNote ? <small>{vm.priceNote}</small> : null}
              <a href={HOTLINE_HREF}>Gọi tư vấn ngay</a>
              <a href="#price" className="product-price-card__link">Xem chi tiết giá & ưu đãi →</a>
            </div>
          ) : (
            <a className="product-buy-cta" href={HOTLINE_HREF}>Gọi tư vấn ngay</a>
          )}
          <p className="product-published">Cập nhật {publishedDisplay} · {vm.authorName}</p>
        </div>
      </div>

      <div className="case-shell product-body">
        {vm.answerFirst ? (
          <article className="case-answer-card" id="answer">
            <span className="case-kicker">KẾT LUẬN NHANH</span>
            <h2>Có nên chọn sản phẩm này?</h2>
            <p>{vm.answerFirst}</p>
          </article>
        ) : null}

        <section className="case-content-section" id="profile">
          <div className="case-section-heading"><div><span className="case-section-no">01</span><h2>{vm.profileHeading}</h2></div></div>
          <p className="case-section-lead">{vm.profileLead}</p>
          <table className="product-spec-table"><tbody>{vm.profileEntries.map((entry) => <tr key={entry.label}><th>{entry.label}</th><td>{entry.value}</td></tr>)}</tbody></table>
        </section>

        <section className="case-content-section" id="editorial">
          <div className="case-section-heading"><div><span className="case-section-no">02</span><h2>{vm.editorialHeading}</h2></div></div>
          <p className="case-section-lead">{vm.editorialLead}</p>
          <ul className="product-feature-list">
            {vm.editorialParagraphs.length ? vm.editorialParagraphs.map((paragraph, index) => <li key={index}><span>✓</span>{paragraph}</li>) : <li><span>✓</span>Chưa cập nhật nội dung chi tiết.</li>}
          </ul>
          <div className="case-editorial-note"><span>{vm.editorialNoteLabel}</span><p>{vm.editorialNoteText}</p></div>
        </section>

        <section className="case-content-section" id="method">
          <div className="case-section-heading"><div><span className="case-section-no">03</span><h2>{vm.methodHeading}</h2></div></div>
          <p className="case-section-lead">{vm.methodLead}</p>
          <table className="product-compare-table">
            <thead><tr><th></th><th>Sản phẩm này</th><th>Lựa chọn khác</th></tr></thead>
            <tbody>
              {vm.methodEntries.map((entry) => <tr key={entry.label}><th>{entry.label}</th><td>{entry.value}</td><td className="product-compare-table__muted">—</td></tr>)}
            </tbody>
          </table>
        </section>

        <TailSections vm={vm} />
      </div>

      <FinalCta />
    </div>
  );
}

export function CaseArticleView({
  vm,
  contentTypeLabel,
  caseCode,
  branchRef,
  publishedDisplay,
  jsonLd,
}: ArticleProps & { jsonLd: unknown }) {
  const props = { vm, contentTypeLabel, caseCode, branchRef, publishedDisplay };
  const body = vm.templateKey === "proof_lab" ? <ProofLabArticle {...props} />
    : vm.templateKey === "brand_story" ? <BrandStoryArticle {...props} />
    : vm.templateKey === "product_spotlight" ? <ProductSpotlightArticle {...props} />
    : <RoadLabArticle {...props} />;
  return <>
    {body}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
  </>;
}
