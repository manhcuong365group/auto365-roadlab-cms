import type { Metadata } from "next";
import Image from "next/image";
import { buildArticleGraph, camryCase, serializeJsonLd } from "../lib/case-lab";

export const metadata: Metadata = {
  title: camryCase.seo.title,
  description: camryCase.seo.description,
  alternates: { canonical: camryCase.seo.canonical },
  // This standalone handoff is a duplicate demo of the Auto365 canonical and
  // must never be indexed. Production derives robots from the published record.
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: camryCase.seo.title,
    description: camryCase.seo.description,
    type: "article",
    url: camryCase.seo.canonical,
    siteName: "Auto365.vn",
    locale: "vi_VN",
    publishedTime: camryCase.identity.published,
    modifiedTime: camryCase.identity.updated,
    section: camryCase.identity.section,
    images: [{ url: camryCase.media.hero.url, alt: camryCase.media.hero.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: camryCase.seo.title,
    description: camryCase.seo.description,
    images: [camryCase.media.hero.url],
  },
};

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function SectionHeading({
  number,
  kicker,
  title,
  badge,
}: {
  number: string;
  kicker: string;
  title: string;
  badge?: string;
}) {
  return (
    <div className="case-section-heading">
      <div>
        <span className="case-section-no">{number}</span>
        <span className="case-kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {badge ? <span className="case-verified-pill">{badge}</span> : null}
    </div>
  );
}

export default function Home() {
  const graph = buildArticleGraph(camryCase);

  return (
    <main className="case-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph) }}
      />

      <header className="case-header">
        <a className="case-brand" href="https://auto365.vn/" aria-label="Auto365">
          <span className="case-brand-mark">A365</span>
          <span className="case-brand-copy">
            <strong>AUTO365</strong>
            <small>XE THẬT · TAY NGHỀ THẬT</small>
          </span>
        </a>
        <nav aria-label="Điều hướng chính">
          <a href="#cau-hinh">Cấu hình</a>
          <a href="#hinh-anh">Hình ảnh</a>
          <a href="#nghiem-thu">Nghiệm thu</a>
          <a href="#chi-phi">Chi phí</a>
        </nav>
        <a className="case-header-cta" href="tel:0365365911">
          Tư vấn: 0365 365 911
        </a>
      </header>

      <article>
        <section className="case-hero" aria-labelledby="page-title">
          <div className="case-hero-media">
            <Image
              src={camryCase.media.hero.url}
              alt={camryCase.media.hero.alt}
              width={1620}
              height={1080}
              sizes="100vw"
              priority
            />
            <div className="case-hero-scrim" />
            <div className="case-image-proof">
              <span /> Ảnh từ đúng ca xe · {camryCase.identity.location}
            </div>
          </div>

          <div className="case-shell case-hero-content">
            <div className="case-breadcrumb" aria-label="Breadcrumb">
              <a href="https://auto365.vn/">Auto365</a>
              <span>/</span>
              <a href={camryCase.identity.sectionUrl}>{camryCase.identity.section}</a>
              <span>/</span>
              <b>Case xe thật</b>
            </div>
            <div className="case-eyebrow-row">
              <span className="case-tag case-tag--red">CASE LAB · V1.4</span>
              <span className="case-tag">CASE ID · {camryCase.identity.id}</span>
            </div>
            <h1 id="page-title">
              Toyota Camry 2014 2.5Q lắp bi gầm:
              <em>X-Light F10 Turbo V2 4300K</em>
            </h1>
            <p className="case-dek">
              Xe thật, cấu hình thật, hình ảnh thật và kết quả nghiệm thu được
              tách rõ khỏi thông số công bố của sản phẩm.
            </p>
            <div className="case-byline">
              <span className="case-avatar" aria-hidden="true">V</span>
              <div>
                <p><strong>{camryCase.identity.author.name}</strong> · {camryCase.identity.author.role}</p>
                <p>Rà soát: <strong>{camryCase.identity.reviewer.name}</strong></p>
              </div>
              <div className="case-date-block">
                <time dateTime={camryCase.identity.published}>Đăng {camryCase.identity.publishedDisplay}</time>
                <time dateTime={camryCase.identity.updated}>Cập nhật {camryCase.identity.updatedDisplay}</time>
              </div>
            </div>
          </div>
        </section>

        <section className="case-fact-strip" aria-label="Thông số tóm tắt">
          <div className="case-shell case-fact-grid">
            {camryCase.decisionFacts.map((fact) => (
              <div key={fact.label}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
                <small>{fact.note}</small>
              </div>
            ))}
          </div>
        </section>

        <div className="case-shell case-article-shell">
          <aside className="case-rail">
            <p>TRONG BÀI NÀY</p>
            <ol>
              <li><a href="#tra-loi-nhanh">Trả lời nhanh</a></li>
              <li><a href="#cau-hinh">Cấu hình đúng ca</a></li>
              <li><a href="#hinh-anh">Album xe thật</a></li>
              <li><a href="#nghiem-thu">Bằng chứng nghiệm thu</a></li>
              <li><a href="#chi-phi">Giá và chi phí</a></li>
              <li><a href="#gioi-han">Giới hạn dữ liệu</a></li>
            </ol>
            <div className="case-rail-card">
              <span>HUB TRỤ CỘT</span>
              <strong>Chọn bi gầm theo nhu cầu và cấu hình xe</strong>
              <a href={camryCase.cluster.hubUrl}>
                Xem hub bi gầm <ArrowIcon />
              </a>
            </div>
            <div className="case-rail-contact">
              <span>GIÁ SẢN PHẨM</span>
              <strong>6.000.000đ/cặp</strong>
              <small>Chưa VAT · chưa phải tổng hoàn thiện</small>
              <a href="tel:0365365911">Gọi tư vấn cấu hình</a>
              <a href="#dat-lich">Kiểm tra xe trước khi lắp</a>
            </div>
          </aside>

          <div className="case-article-body">
            <nav className="case-mobile-toc" aria-label="Mục lục nhanh">
              <a href="#tra-loi-nhanh">Trả lời nhanh</a>
              <a href="#cau-hinh">Cấu hình</a>
              <a href="#hinh-anh">Ảnh xe thật</a>
              <a href="#nghiem-thu">Nghiệm thu</a>
              <a href="#chi-phi">Chi phí</a>
            </nav>
            <section className="case-answer-card" id="tra-loi-nhanh">
              <span className="case-kicker">TRẢ LỜI NHANH · DỮ LIỆU ĐÚNG CA</span>
              <h2>Camry 2014 trong bài đã lắp cấu hình nào?</h2>
              <p>{camryCase.answer}</p>
              <div className="case-answer-grid">
                <div><span>ĐIỆN</span><b>Relay + cầu chì bảo vệ nguồn</b></div>
                <div><span>CAN THIỆP</span><b>Không ghi nhận cắt chi tiết zin</b></div>
                <div><span>NGHIỆM THU</span><b>Không ghi nhận cảnh báo điện</b></div>
              </div>
              <div className="case-inline-links">
                <a href={camryCase.cluster.hubUrl}>
                  Hướng dẫn chọn bi gầm theo nhu cầu <ArrowIcon />
                </a>
                <a href={camryCase.cluster.productUrl}>
                  Xem sản phẩm F10 Turbo V2 <ArrowIcon />
                </a>
              </div>
            </section>

            <section className="case-passport" aria-labelledby="passport-title">
              <div className="case-passport-head">
                <span className="case-kicker">HỘ CHIẾU CA XE</span>
                <h2 id="passport-title">Một hồ sơ, ba mức xác minh</h2>
                <p>Trạng thái hiển thị công khai để người đọc và máy tìm kiếm không đánh đồng dữ liệu.</p>
              </div>
              <div className="case-passport-grid">
                <dl>
                  <div><dt>Xe</dt><dd>{camryCase.vehicle.make} {camryCase.vehicle.model} {camryCase.vehicle.year}</dd></div>
                  <div><dt>Phiên bản</dt><dd>{camryCase.vehicle.trim}</dd></div>
                  <div><dt>Ngày dữ liệu</dt><dd>{camryCase.identity.dataDateDisplay}</dd></div>
                  <div><dt>Điểm thi công</dt><dd>{camryCase.identity.location}</dd></div>
                  <div><dt>Sản phẩm</dt><dd><a href={camryCase.cluster.productUrl}>{camryCase.cluster.productName}</a></dd></div>
                  <div><dt>Nhóm nội dung</dt><dd><a href={camryCase.identity.sectionUrl}>{camryCase.identity.section}</a></dd></div>
                </dl>
                <div className="case-evidence-states">
                  {camryCase.evidenceStates.map((state) => (
                    <div className={`case-state case-state--${state.tone}`} key={state.label}>
                      <span />
                      <p><b>{state.label}</b><small>{state.note}</small></p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="case-snapshot" id="cau-hinh">
              <SectionHeading
                number="01"
                kicker="HỒ SƠ THI CÔNG"
                title="Cấu hình đúng ca Toyota Camry 2014 2.5Q"
                badge="XÁC NHẬN TRÊN CA XE"
              />
              <div className="case-snapshot-grid">
                <figure>
                  <Image
                    src={camryCase.media.vehicle.url}
                    alt={camryCase.media.vehicle.alt}
                    width={1620}
                    height={1080}
                    sizes="(max-width: 700px) 100vw, 520px"
                  />
                  <figcaption>{camryCase.media.vehicle.caption}</figcaption>
                </figure>
                <dl>
                  {camryCase.fitment.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                      <small className={`case-proof case-proof--${row.proof}`}>{row.proofLabel}</small>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section className="case-content-section" id="hinh-anh">
              <SectionHeading
                number="02"
                kicker="ALBUM ĐÚNG CA XE"
                title="Chi tiết hoàn thiện được kể bằng hình ảnh"
                badge="03 ẢNH CHI TIẾT"
              />
              <p className="case-section-lead">
                Mỗi ảnh có vai trò và chú thích riêng; không dùng ảnh trang trí không thuộc hồ sơ ca xe.
              </p>
              <div className="case-photo-story">
                {camryCase.media.details.map((item, index) => (
                  <figure className={index === 0 ? "case-photo-story__large" : ""} key={item.url}>
                    <Image src={item.url} alt={item.alt} width={1620} height={1080} sizes={index === 0 ? "(max-width: 700px) 100vw, 540px" : "(max-width: 700px) 100vw, 270px"} />
                    <figcaption><b>{item.label}</b><span>{item.caption}</span></figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <section className="case-content-section">
              <SectionHeading
                number="03"
                kicker="NHU CẦU → CẤU HÌNH"
                title="Vì sao đúng ca Camry này chọn 4300K?"
              />
              <div className="case-editorial-split">
                <div>
                  <p>
                    Theo hồ sơ ca lắp, chủ xe thường đi tỉnh và muốn màu sáng
                    trung tính để bổ sung vùng sáng thấp phía trước trong điều
                    kiện thiếu sáng. Vì vậy, cấu hình được chọn là <strong>F10 Turbo V2 4300K</strong>.
                  </p>
                  <p>
                    Đây là lý do của đúng chủ xe trong bài, không phải cấu hình
                    mặc định cho mọi Toyota Camry 2014.
                  </p>
                  <div className="case-editorial-note">
                    <span>NGUYÊN TẮC BIÊN TẬP</span>
                    <p>Case chỉ giải thích lựa chọn thực tế; kiến thức so sánh chuyên sâu thuộc hub.</p>
                  </div>
                </div>
                <figure>
                  <Image src={camryCase.media.product.url} alt={camryCase.media.product.alt} width={1620} height={1080} sizes="(max-width: 700px) 100vw, 420px" />
                  <figcaption>{camryCase.media.product.caption}</figcaption>
                </figure>
              </div>

              <div className="case-method-card">
                <div>
                  <span className="case-kicker">PHƯƠNG ÁN THI CÔNG ĐÚNG CA</span>
                  <h3>Có gia công trên gá rời, không đồng nghĩa cắt sửa xe</h3>
                  <p>Kỹ thuật viên tháo cản, dùng pát đi kèm và hoàn thiện trên bộ gá rời. Hồ sơ không ghi nhận cắt sửa chi tiết nguyên bản.</p>
                </div>
                <dl>
                  <div><dt>Cố định</dt><dd>Pát kèm + bộ gá rời</dd></div>
                  <div><dt>Bảo vệ nguồn</dt><dd>Relay + cầu chì</dd></div>
                  <div><dt>Điều khiển</dt><dd>Có công tắc</dd></div>
                  <div><dt>Chưa đủ chi tiết</dt><dd>Logic kích hoạt và định mức cầu chì</dd></div>
                </dl>
              </div>
            </section>

            <section className="case-content-section">
              <SectionHeading
                number="04"
                kicker="CÔNG BỐ SẢN PHẨM"
                title="Thông số F10 Turbo V2 không phải kết quả đo trên xe"
                badge="NGUỒN X-LIGHT / 365GROUP"
              />
              <div className="case-metric-grid">
                {camryCase.productMetrics.map((metric) => (
                  <div key={metric.label}>
                    <span>{metric.label}</span>
                    <b>{metric.value}</b>
                    <small>{metric.note}</small>
                  </div>
                ))}
              </div>
              <p className="case-source-note">
                Công suất và IP68 là dữ liệu công bố của sản phẩm; không tự động đại diện cho dây, giắc, relay, điểm nối hoặc hiệu quả thực tế trên mọi xe.
              </p>
            </section>

            <section className="case-price-section" id="chi-phi">
              <div>
                <span className="case-kicker case-kicker--light">MINH BẠCH CHI PHÍ</span>
                <h2>6 triệu là giá sản phẩm, không phải giá hoàn thiện</h2>
                <p>Báo giá cuối chỉ chốt sau khi kiểm tra hiện trạng xe và phụ kiện cần dùng.</p>
                <strong className="case-big-price">6.000.000 <small>đ / cặp</small></strong>
                <small>01 cặp = 02 đèn · chưa bao gồm VAT</small>
              </div>
              <dl>
                <div className="known"><dt>01 cặp F10 Turbo V2</dt><dd>6.000.000đ</dd></div>
                <div><dt>Thuế VAT</dt><dd>Chưa bao gồm</dd></div>
                <div><dt>Công tháo / lắp</dt><dd>Chưa công bố</dd></div>
                <div><dt>Pát, phụ kiện phát sinh</dt><dd>Chưa công bố</dd></div>
                <div><dt>Tổng hóa đơn ca Camry</dt><dd>Chưa công bố</dd></div>
              </dl>
            </section>

            <section className="case-content-section" id="nghiem-thu">
              <SectionHeading
                number="05"
                kicker="PHÒNG THỬ ÁNH SÁNG"
                title="Vùng sáng ghi nhận sau lắp và căn chỉnh"
                badge="ẢNH ĐÚNG CA XE"
              />
              <p className="case-section-lead">
                Ảnh minh họa kết quả đúng ca nhưng chưa phải phép đo lux, candela hoặc tầm chiếu chuẩn hóa.
              </p>
              <div className="case-beam-grid">
                {camryCase.media.beams.map((image) => (
                  <figure key={image.label}>
                    <div><span>{image.label}</span><b>{image.label === "COS" ? "Vùng sáng gần" : "Vùng sáng xa"}</b></div>
                    <Image src={image.url} alt={image.alt} width={1620} height={1080} sizes="(max-width: 700px) 100vw, 420px" />
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
              </div>

              <div className="case-qc-card">
                <div className="case-qc-head">
                  <span><i /> NGHIỆM THU TẠI THỜI ĐIỂM BÀN GIAO</span>
                  <b>{camryCase.inspection.length}/{camryCase.inspection.length} hạng mục đã kiểm tra</b>
                </div>
                <div className="case-qc-grid">
                  {camryCase.inspection.map((item) => (
                    <div key={item.label}><span>✓</span><p><small>{item.label}</small><b>{item.result}</b></p></div>
                  ))}
                </div>
                <p>“Không ghi nhận” chỉ phản ánh thời điểm bàn giao, không phải cam kết cho toàn bộ vòng đời sử dụng.</p>
              </div>
            </section>

            <section className="case-ledger-section" id="gioi-han">
              <SectionHeading
                number="06"
                kicker="EVIDENCE LEDGER"
                title="Ca lắp cho thấy gì — và chưa thể kết luận gì?"
              />
              <div className="case-ledger-grid">
                <div className="case-ledger case-ledger--yes">
                  <h3><span>✓</span> Đã xác nhận</h3>
                  <ul>{camryCase.known.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div className="case-ledger case-ledger--unknown">
                  <h3><span>—</span> Chưa đủ dữ liệu</h3>
                  <ul>{camryCase.unknown.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>
            </section>

            <section className="case-content-section">
              <SectionHeading
                number="07"
                kicker="QUY TRÌNH CÓ KIỂM SOÁT"
                title="Sáu điểm phải ghi nhận trong hồ sơ thi công"
              />
              <ol className="case-timeline">
                {camryCase.timeline.map((step, index) => (
                  <li key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><b>{step.title}</b><p>{step.text}</p></div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="case-followup-section">
              <SectionHeading
                number="08"
                kicker="NHẬT KÝ HẬU KIỂM"
                title="Cập nhật cùng URL, không mở bài trùng intent"
                badge="CHƯA CÓ DỮ LIỆU 7–30 NGÀY"
              />
              <div className="case-followup-track">
                <div className="done"><b>NGÀY 0</b><span>Nghiệm thu tại xưởng</span></div>
                <div><b>NGÀY 7</b><span>Chờ phản hồi vận hành</span></div>
                <div><b>NGÀY 30</b><span>Chờ kiểm tra lại</span></div>
              </div>
            </section>

            <section className="case-faq-section" id="faq">
              <SectionHeading
                number="09"
                kicker="HỎI ĐÚNG CA · ĐÁP ĐÚNG DỮ LIỆU"
                title="Câu hỏi thường gặp về Camry 2014 × F10 Turbo V2"
              />
              <div>
                {camryCase.faq.map((item, index) => (
                  <details key={item.q} open={index === 0}>
                    <summary><span>{String(index + 1).padStart(2, "0")}</span>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="case-author-section">
              <div className="case-author-person">
                <span className="case-avatar case-avatar--large">V</span>
                <div><span>NGƯỜI VIẾT</span><h3>{camryCase.identity.author.name}</h3><p>{camryCase.identity.author.role} · biên tập từ hồ sơ ca xe.</p></div>
              </div>
              <div><span>RÀ SOÁT KỸ THUẬT</span><h3>{camryCase.identity.reviewer.name}</h3><p>{camryCase.identity.reviewer.role}.</p></div>
              <div className="case-editorial-policy">
                <span>NGUỒN & CẬP NHẬT</span>
                <ul>
                  {camryCase.sources.map((source) => (
                    <li key={`${source.name}-${source.dateModified}`}>{source.name} · cập nhật <time dateTime={source.dateModified}>{source.dateModified}</time></li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="case-final-cta" id="dat-lich">
              <div>
                <span className="case-kicker case-kicker--light">KIỂM TRA TRƯỚC · CHỐT SAU</span>
                <h2>Anh đang sử dụng Toyota Camry 2014 2.5Q?</h2>
                <p>Đặt lịch kiểm tra hốc đèn, pát và phương án điện trước khi chốt cấu hình.</p>
                <div><a href="tel:0365365911">Gọi 0365 365 911</a><a href="https://zalo.me/0365365911">Tư vấn qua Zalo</a></div>
              </div>
              <dl>
                <div><dt>Điểm kiểm tra</dt><dd>{camryCase.branch.name}</dd></div>
                <div><dt>Địa chỉ</dt><dd>{camryCase.branch.address}</dd></div>
                <div><dt>Giờ làm việc</dt><dd>08:30–17:30</dd></div>
              </dl>
            </section>

            <nav className="case-cluster-links" aria-label="Đọc tiếp trong cụm nội dung bi gầm">
              <a href={camryCase.cluster.hubUrl}><span>HUB TRỤ CỘT</span><b>So sánh cấu hình, nhiệt màu và chi phí bi gầm</b><ArrowIcon /></a>
              <a href={camryCase.cluster.productUrl}><span>TRANG SẢN PHẨM</span><b>Thông số X-Light F10 Turbo V2</b><ArrowIcon /></a>
              <a href="https://auto365.vn/toyota-innova-2018-do-bi-gam-x-light-f10-turbo-v2-5500k"><span>CASE LIÊN QUAN</span><b>Innova Venturer 2018 × F10 Turbo V2 5500K</b><ArrowIcon /></a>
            </nav>
          </div>
        </div>
      </article>

      <nav className="case-mobile-action" aria-label="Liên hệ nhanh">
        <a href="tel:0365365911">Gọi</a>
        <a href="https://zalo.me/0365365911">Zalo</a>
        <a href="#dat-lich">Đặt lịch</a>
      </nav>
    </main>
  );
}
