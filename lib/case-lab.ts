export type Proof = "maker" | "case" | "unknown";

export type CaseLabData = {
  identity: {
    id: string; title: string; published: string; publishedDisplay: string;
    updated: string; updatedDisplay: string; dataDateDisplay: string; location: string;
    status: "draft" | "review" | "published";
    section: string; sectionUrl: string;
    author: { name: string; role: string; profileUrl?: string };
    reviewer: { name: string; role: string; profileUrl?: string };
  };
  vehicle: { make: string; model: string; year: string; trim: string };
  cluster: {
    hubUrl: string; hubName: string; collectionUrl: string;
    productUrl: string; productEntityId: string; productName: string; brandName: string;
  };
  branch: { id: string; name: string; url: string; telephone: string; address: string };
  sources: { name: string; dateModified: string; url?: string }[];
  seo: { title: string; description: string; canonical: string; keywords: string[] };
  answer: string;
  evidenceStates: { label: string; note: string; tone: "verified" | "workshop" | "pending" }[];
  decisionFacts: { label: string; value: string; note: string }[];
  fitment: { label: string; value: string; proof: Proof; proofLabel: string }[];
  productMetrics: { label: string; value: string; note: string }[];
  media: {
    hero: { url: string; alt: string; caption: string };
    vehicle: { url: string; alt: string; caption: string };
    product: { url: string; alt: string; caption: string };
    details: { label: string; url: string; alt: string; caption: string }[];
    beams: { label: string; url: string; alt: string; caption: string }[];
  };
  timeline: { title: string; text: string }[];
  inspection: { label: string; result: string }[];
  known: string[]; unknown: string[];
  faq: { q: string; a: string }[];
};

export const camryCase: CaseLabData = {
  identity: {
    id: "ACL-260810-LGT-001",
    title: "Toyota Camry 2014 2.5Q lắp bi gầm X-Light F10 Turbo V2 4300K",
    published: "2026-08-08T08:30:00+07:00", publishedDisplay: "08/08/2026",
    updated: "2026-08-10T17:30:00+07:00", updatedDisplay: "10/08/2026",
    dataDateDisplay: "10/08/2026", location: "Auto365.vn - Trụ Sở Chính",
    status: "published",
    section: "Cẩm nang ánh sáng ô tô",
    sectionUrl: "https://auto365.vn/cam-nang-anh-sang-o-to",
    author: { name: "Vinh", role: "Team Content Auto365" },
    reviewer: { name: "Nguyễn Quang Đạo", role: "Rà soát kỹ thuật phụ kiện điện tử ô tô" },
  },
  vehicle: { make: "Toyota", model: "Camry", year: "2014", trim: "2.5Q" },
  cluster: {
    hubUrl: "https://auto365.vn/nang-cap-anh-sang-bi-gam",
    hubName: "Bi gầm ô tô",
    collectionUrl: "https://auto365.vn/cam-nang-anh-sang-o-to",
    productUrl: "https://auto365.vn/den-bi-gam-x-light-f10-turbo-v2",
    productEntityId: "https://auto365.vn/#product-x-light-f10-turbo-v2",
    productName: "X-Light F10 Turbo V2",
    brandName: "X-Light",
  },
  branch: {
    id: "https://auto365.vn/#auto365-tru-so-chinh",
    name: "Auto365.vn - Trụ Sở Chính",
    url: "https://auto365.vn/",
    telephone: "+84365365911",
    address: "4/4/1/7 Đường Số 3, Phường Hiệp Bình, TP. Hồ Chí Minh",
  },
  sources: [
    { name: "Tài liệu sản phẩm X-Light / 365Group", dateModified: "2026-08-10" },
    { name: "Hồ sơ thi công Toyota Camry 2014 2.5Q tại Auto365.vn - Trụ Sở Chính", dateModified: "2026-08-10" },
  ],
  seo: {
    title: "Camry 2014 lắp bi gầm X-Light F10 Turbo V2 4300K",
    description: "Ca thực tế Toyota Camry 2014 2.5Q lắp F10 Turbo V2 4300K: cấu hình, pát, điện, giá 6 triệu/cặp và nghiệm thu tại xưởng.",
    canonical: "https://auto365.vn/toyota-camry-2014-25q-lap-bi-gam-x-light-f10-turbo-v2-gia-cau-hinh",
    keywords: ["Toyota Camry 2014 lắp bi gầm", "X-Light F10 Turbo V2", "bi gầm 4300K", "case xe thật Auto365"],
  },
  answer: "Toyota Camry 2014 2.5Q trong bài đã lắp 01 cặp X-Light F10 Turbo V2 4300K tại hốc đèn gầm. Ca này có tháo cản; kỹ thuật viên dùng pát kèm sản phẩm và gia công trên bộ gá rời, không ghi nhận cắt sửa chi tiết nguyên bản. Giá sản phẩm 6.000.000 VNĐ/cặp, chưa VAT. Tại bàn giao, Cos/Pha hoạt động sau căn chỉnh và không ghi nhận cảnh báo điện liên quan đến bộ đèn.",
  evidenceStates: [
    { label: "Đã xác nhận thi công", note: "Hồ sơ đúng ca Camry 2014 2.5Q", tone: "verified" },
    { label: "Đã nghiệm thu tại xưởng", note: "Cos/Pha, pát và điện đã kiểm tra", tone: "workshop" },
    { label: "Chưa hậu kiểm 7–30 ngày", note: "Không tự tạo phản hồi sau sử dụng", tone: "pending" },
  ],
  decisionFacts: [
    { label: "CẤU HÌNH", value: "F10 Turbo V2 · 4300K", note: "01 cặp / 02 đèn" },
    { label: "CAN THIỆP", value: "Có tháo cản", note: "Gia công trên bộ gá rời" },
    { label: "GIÁ SẢN PHẨM", value: "6.000.000 VNĐ", note: "Chưa VAT · chưa phải tổng bill" },
    { label: "BẢO HÀNH", value: "24 tháng", note: "Theo công bố nhà sản xuất" },
  ],
  fitment: [
    { label: "Sản phẩm & vị trí", value: "X-Light F10 Turbo V2 tại hốc đèn gầm", proof: "case", proofLabel: "Đúng ca" },
    { label: "Nhiệt màu đã chọn", value: "4300K — đi tỉnh, cần màu trung tính", proof: "case", proofLabel: "Đúng ca" },
    { label: "Pát / bộ gá", value: "Pát kèm sản phẩm, gia công trên bộ gá rời", proof: "case", proofLabel: "Đúng ca" },
    { label: "Tháo cản", value: "Có, áp dụng trong ca này", proof: "case", proofLabel: "Đúng ca" },
    { label: "Cắt sửa xe", value: "Không ghi nhận cắt sửa chi tiết nguyên bản", proof: "case", proofLabel: "Theo hồ sơ" },
    { label: "Relay / cầu chì", value: "Có relay và cầu chì bảo vệ nguồn", proof: "case", proofLabel: "Đúng ca" },
    { label: "Logic kích hoạt", value: "Có công tắc; hồ sơ không lưu logic chi tiết", proof: "unknown", proofLabel: "Thiếu chi tiết" },
    { label: "Đèn gầm trước nâng cấp", value: "Hồ sơ chưa đủ dữ liệu để công bố", proof: "unknown", proofLabel: "Chưa có" },
  ],
  productMetrics: [
    { label: "Công suất Cos", value: "≈ 45W", note: "Theo tài liệu sản phẩm" },
    { label: "Công suất Pha", value: "≈ 75W", note: "Theo tài liệu sản phẩm" },
    { label: "Kích thước lens", value: "3.0 inch", note: "Thấu kính sản phẩm" },
    { label: "Nguồn sáng", value: "6 + 1 + 1 chip", note: "LED chính + Osram hỗ trợ pha" },
    { label: "Điện áp", value: "12–16V", note: "Dải vận hành công bố" },
    { label: "Kháng nước/bụi", value: "IP68", note: "Chỉ áp dụng cho sản phẩm" },
  ],
  media: {
    hero: {
      url: "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-3-img_6a76e42ca2ae17.28365604.jpg",
      alt: "Toyota Camry 2014 2.5Q sau khi lắp X-Light F10 Turbo V2 tại Auto365",
      caption: "Toyota Camry 2014 2.5Q trong đúng hồ sơ ca lắp tại Auto365.vn - Trụ Sở Chính.",
    },
    vehicle: {
      url: "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-5-img_6a76e3a30c1f30.24597607.jpg",
      alt: "Toàn cảnh Toyota Camry 2014 2.5Q và hộp X-Light F10 Turbo V2 tại Auto365",
      caption: "Toàn cảnh đúng chiếc xe và sản phẩm trong hồ sơ ca lắp.",
    },
    product: {
      url: "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-2-img_6a76e3bc5a7db0.38488086.jpg",
      alt: "Hộp sản phẩm X-Light F10 Turbo V2 đặt trên Toyota Camry 2014",
      caption: "Bằng chứng sản phẩm từ đúng ca xe · ngày dữ liệu 10/08/2026.",
    },
    details: [
      {
        label: "HỐC ĐÈN TRÁI",
        url: "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-1-img_6a76e47a764051.86525682.jpg",
        alt: "Cận cảnh hốc đèn trái Toyota Camry 2014 sau khi lắp X-Light F10 Turbo V2",
        caption: "Cận cảnh sản phẩm sau thi công trên đúng xe.",
      },
      {
        label: "HỐC ĐÈN PHẢI",
        url: "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-4-img_6a76e3d65eee07.05310183.jpg",
        alt: "Cận cảnh hốc đèn phải Toyota Camry 2014 sau khi lắp X-Light F10 Turbo V2",
        caption: "Góc đối diện dùng để đối chiếu độ hoàn thiện hai bên.",
      },
      {
        label: "ĐÈN HOẠT ĐỘNG",
        url: "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-8-img_6a76e45bb52471.49479397.jpg",
        alt: "X-Light F10 Turbo V2 hoạt động tại hốc đèn gầm Toyota Camry 2014",
        caption: "Ảnh ghi nhận trạng thái hoạt động tại xưởng; không phải phép đo quang học.",
      },
    ],
    beams: [
      {
        label: "COS",
        url: "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-6-img_6a76e3ef05fbe1.86984057.jpg",
        alt: "Vùng sáng Cos của Toyota Camry 2014 sau khi lắp F10 Turbo V2",
        caption: "Ảnh đúng xe, chụp tại xưởng sau căn chỉnh; chưa phải phép đo chuẩn hóa.",
      },
      {
        label: "PHA",
        url: "https://auto365.vn/uploads/images/pages/auto365vn-toyota-camry-2014-2-5-q-lap-bi-gam-x-light-f10-turbo-v2-7-img_6a76e4078402a9.23620130.jpg",
        alt: "Vùng sáng Pha của Toyota Camry 2014 sau khi lắp F10 Turbo V2",
        caption: "Ảnh đúng xe, cùng ca nghiệm thu; không suy ra lux hoặc tầm chiếu tuyệt đối.",
      },
    ],
  },
  timeline: [
    { title: "Kiểm tra hiện trạng", text: "Đối chiếu hốc đèn, điểm bắt pát, nguồn điện, cảm biến và khoảng trống phía sau." },
    { title: "Khóa cấu hình", text: "Chốt F10 Turbo V2 4300K theo nhu cầu đi tỉnh và vùng sáng trung tính." },
    { title: "Tháo cản & chuẩn bị gá", text: "Tháo cản trong đúng ca này; hoàn thiện pát trên bộ gá rời." },
    { title: "Lắp đèn & bảo vệ nguồn", text: "Cố định đèn, bố trí dây, relay và cầu chì theo phương án đã duyệt." },
    { title: "Căn chỉnh Cos/Pha", text: "Kiểm tra độ cân bằng hai bên và hướng chiếu sau lắp." },
    { title: "QC & bàn giao", text: "Rà soát pát, điện, Cos/Pha và cảnh báo trên xe tại thời điểm bàn giao." },
  ],
  inspection: [
    { label: "Cos", result: "Hoạt động sau căn chỉnh" },
    { label: "Pha", result: "Hoạt động sau căn chỉnh" },
    { label: "Cân bằng hai bên", result: "Đã kiểm tra" },
    { label: "Cảnh báo điện", result: "Không ghi nhận tại nghiệm thu" },
    { label: "Pát / bộ gá", result: "Đã kiểm tra độ chắc chắn" },
    { label: "Relay / cầu chì", result: "Đã kiểm tra" },
  ],
  known: [
    "Xe, phiên bản, sản phẩm, nhiệt màu và vị trí lắp",
    "Có tháo cản; gia công trên pát/bộ gá rời",
    "Có relay, cầu chì và công tắc điều khiển",
    "Cos/Pha hoạt động; không ghi nhận cảnh báo điện lúc bàn giao",
    "Giá sản phẩm, VAT và thời hạn bảo hành",
  ],
  unknown: [
    "Lux, tầm chiếu và phép đo quang học chuẩn hóa",
    "Tổng hóa đơn hoàn thiện của đúng ca xe",
    "Chi tiết logic kích hoạt công tắc",
    "Cấu hình đèn gầm trước khi nâng cấp",
    "Phản hồi sau 7 ngày và hậu kiểm sau 30 ngày",
  ],
  faq: [
    { q: "Ca Camry 2014 này có phải tháo cản không?", a: "Có. Hồ sơ ca xe ghi nhận kỹ thuật viên đã tháo cản để thao tác. Câu trả lời này chỉ áp dụng cho đúng ca Camry 2014 2.5Q trong bài." },
    { q: "Vì sao chủ xe chọn 4300K?", a: "Chủ xe thường đi tỉnh và muốn màu sáng trung tính để bổ sung vùng sáng phía trước trong điều kiện thiếu sáng. Đây là lý do của đúng ca, không phải khuyến nghị mặc định cho mọi xe." },
    { q: "Giá 6 triệu đã gồm công lắp và VAT chưa?", a: "Chưa. 6.000.000 VNĐ/cặp là giá sản phẩm tham khảo, chưa VAT. Bài chưa công bố tổng hóa đơn hoàn thiện của ca Camry này." },
    { q: "Lắp xong có báo lỗi điện không?", a: "Tại thời điểm nghiệm thu, không ghi nhận cảnh báo điện liên quan đến bộ đèn. Hồ sơ chưa có hậu kiểm 7–30 ngày nên không suy rộng cho toàn bộ thời gian sử dụng." },
  ],
};

export function buildArticleGraph(data: CaseLabData) {
  const imageRecords = [
    { role: "hero", url: data.media.hero.url, caption: data.media.hero.caption },
    { role: "vehicle", url: data.media.vehicle.url, caption: data.media.vehicle.caption },
    { role: "product", url: data.media.product.url, caption: data.media.product.caption },
    ...data.media.details.map((item, index) => ({ role: `detail-${index + 1}`, url: item.url, caption: item.caption })),
    ...data.media.beams.map((item) => ({ role: `beam-${item.label.toLowerCase()}`, url: item.url, caption: item.caption })),
  ].filter((item, index, array) => array.findIndex((candidate) => candidate.url === item.url) === index);
  const personId = (name: string) => `https://auto365.vn/#person-${name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
  const pageId = `${data.seo.canonical}#webpage`;
  const articleId = `${data.seo.canonical}#article`;
  const breadcrumbId = `${data.seo.canonical}#breadcrumb`;
  const authorId = data.identity.author.profileUrl ?? personId(data.identity.author.name);
  const reviewerId = data.identity.reviewer.profileUrl ?? personId(data.identity.reviewer.name);
  const publisherId = "https://auto365.vn/#organization";
  const websiteId = "https://auto365.vn/#website";
  const vehicleId = `${data.seo.canonical}#vehicle`;
  const productId = data.cluster.productEntityId;
  const imageRefs = imageRecords.map((item) => ({ "@id": `${data.seo.canonical}#image-${item.role}` }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": articleId,
        headline: data.identity.title,
        description: data.seo.description,
        datePublished: data.identity.published,
        dateModified: data.identity.updated,
        inLanguage: "vi-VN",
        articleSection: data.identity.section,
        keywords: data.seo.keywords.join(", "),
        mainEntityOfPage: { "@id": pageId },
        image: imageRefs,
        author: { "@id": authorId },
        reviewedBy: { "@id": reviewerId },
        publisher: { "@id": publisherId },
        contentLocation: { "@id": data.branch.id },
        citation: data.sources.map((source) => ({
          "@type": "CreativeWork",
          name: source.name,
          dateModified: source.dateModified,
          ...(source.url ? { url: source.url } : {}),
        })),
        about: [{ "@id": vehicleId }, { "@id": productId }],
        isPartOf: { "@type": "CollectionPage", "@id": `${data.cluster.hubUrl}#hub`, name: data.cluster.hubName },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: data.seo.canonical,
        name: data.seo.title,
        description: data.seo.description,
        inLanguage: "vi-VN",
        isPartOf: { "@id": websiteId },
        breadcrumb: { "@id": breadcrumbId },
        primaryImageOfPage: imageRefs[0],
        mainEntity: { "@id": articleId },
        about: [{ "@id": vehicleId }, { "@id": productId }],
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Auto365", item: "https://auto365.vn/" },
          { "@type": "ListItem", position: 2, name: data.identity.section, item: data.identity.sectionUrl },
          { "@type": "ListItem", position: 3, name: data.identity.title, item: data.seo.canonical },
        ],
      },
      {
        "@type": "Person",
        "@id": authorId,
        name: data.identity.author.name,
        jobTitle: data.identity.author.role,
        ...(data.identity.author.profileUrl ? { url: data.identity.author.profileUrl } : {}),
      },
      {
        "@type": "Person",
        "@id": reviewerId,
        name: data.identity.reviewer.name,
        jobTitle: data.identity.reviewer.role,
        ...(data.identity.reviewer.profileUrl ? { url: data.identity.reviewer.profileUrl } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: "https://auto365.vn/",
        name: "Auto365.vn",
        inLanguage: "vi-VN",
        publisher: { "@id": publisherId },
      },
      {
        "@type": "Organization",
        "@id": publisherId,
        name: "Auto365.vn",
        url: "https://auto365.vn/",
      },
      {
        "@type": "AutomotiveBusiness",
        "@id": data.branch.id,
        name: data.branch.name,
        url: data.branch.url,
        telephone: data.branch.telephone,
        address: {
          "@type": "PostalAddress",
          streetAddress: data.branch.address,
          addressCountry: "VN",
        },
        parentOrganization: { "@id": publisherId },
      },
      {
        "@type": "Vehicle",
        "@id": vehicleId,
        name: `${data.vehicle.make} ${data.vehicle.model} ${data.vehicle.year} ${data.vehicle.trim}`,
        brand: { "@type": "Brand", name: data.vehicle.make },
        model: data.vehicle.model,
        vehicleModelDate: data.vehicle.year,
      },
      {
        "@type": "Product",
        "@id": productId,
        name: data.cluster.productName,
        url: data.cluster.productUrl,
        brand: { "@type": "Brand", name: data.cluster.brandName },
      },
      ...imageRecords.map((item, index) => ({
        "@type": "ImageObject",
        "@id": `${data.seo.canonical}#image-${item.role}`,
        contentUrl: item.url,
        caption: item.caption,
        inLanguage: "vi-VN",
        representativeOfPage: index === 0,
      })),
      {
        "@type": "FAQPage",
        "@id": `${data.seo.canonical}#faq`,
        mainEntity: data.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
