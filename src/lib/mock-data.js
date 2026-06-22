export const mockWebinars = [
  {
    id: 'ai-agent-2025',
    slug: 'ai-agent-2025',
    title: 'AI Agent Thực Chiến 2025',
    subtitle: 'Xây dựng và triển khai hệ thống AI Agent tự động cho doanh nghiệp SME',
    instructor: 'Hung Trinh',
    instructorTitle: 'Chuyên gia AI & Founder Hung Trinh AI',
    instructorBio: 'Hơn 10 năm kinh nghiệm trong đào tạo và tư vấn giải pháp AI cho doanh nghiệp tại Việt Nam.',
    date: '2026-07-15',
    time: '19:00',
    duration: '3 giờ',
    format: 'Online Live',
    level: 'Trung cấp',
    price: 499000,
    originalPrice: 999000,
    seats: 100,
    seatsLeft: 23,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mXg',
    tags: ['AI Agent', 'Automation', 'SME', 'No-code'],
    highlights: [
      'Hiểu bản chất và kiến trúc AI Agent hiện đại',
      'Xây dựng agent tự động trả lời khách hàng 24/7',
      'Tích hợp vào quy trình bán hàng và chăm sóc khách hàng',
      'Demo live 5 use case thực tế tại doanh nghiệp Việt',
      'Template workflow miễn phí sau webinar',
      'Hỗ trợ Q&A trực tiếp với chuyên gia',
    ],
    curriculum: [
      {
        id: 1, title: 'Giới thiệu AI Agent & Kiến trúc hệ thống',
        duration: '30 phút', type: 'video',
      },
      {
        id: 2, title: 'Các nền tảng no-code xây dựng agent (Make, n8n, Flowise)',
        duration: '45 phút', type: 'video',
      },
      {
        id: 3, title: 'Demo thực tế: Agent tự động phân loại lead',
        duration: '40 phút', type: 'demo',
      },
      {
        id: 4, title: 'Demo thực tế: Chatbot chăm sóc khách hàng 24/7',
        duration: '35 phút', type: 'demo',
      },
      {
        id: 5, title: 'Q&A và hướng dẫn nhận template',
        duration: '30 phút', type: 'qa',
      },
    ],
  },
];

export const mockCourses = [
  {
    id: 'ai-mastery-pro',
    slug: 'ai-mastery-pro',
    title: 'AI Mastery Pro',
    subtitle: 'Làm chủ AI toàn diện từ nền tảng đến ứng dụng thực tiễn',
    level: 'ADVANCED',
    icon: 'psychology',
    lessonsCount: 12,
    price: 2499000,
    progress: 65,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mXg',
    description: 'Dành cho cấp quản lý muốn tích hợp AI vào quy trình vận hành và tối ưu hóa hiệu suất đội ngũ.',
  },
  {
    id: 'chatgpt-prompt-engineering',
    slug: 'chatgpt-prompt-engineering',
    title: 'Làm chủ ChatGPT & Prompt Engineering',
    subtitle: 'Kỹ thuật đặt câu hỏi chuyên sâu để biến AI thành trợ lý đắc lực',
    level: 'POPULAR',
    icon: 'smart_toy',
    lessonsCount: 8,
    price: 599000,
    progress: 30,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mXg',
    description: 'Kỹ thuật đặt câu hỏi chuyên sâu để biến AI thành trợ lý đắc lực trong mọi lĩnh vực công việc.',
  },
  {
    id: 'generative-ai-marketing',
    slug: 'generative-ai-marketing',
    title: 'Generative AI trong Marketing & Design',
    subtitle: 'Ứng dụng AI sáng tạo để đột phá hình ảnh thương hiệu',
    level: 'CREATIVE',
    icon: 'brush',
    lessonsCount: 15,
    price: 1250000,
    progress: 0,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mXg',
    description: 'Ứng dụng Midjourney, Canva AI và các công cụ sáng tạo để đột phá hình ảnh thương hiệu.',
  },
  {
    id: 'ai-fundamentals',
    slug: 'ai-fundamentals',
    title: 'AI Fundamentals',
    subtitle: 'Nền tảng AI vững chắc cho người mới bắt đầu',
    level: 'BEGINNER',
    icon: 'school',
    lessonsCount: 10,
    price: 299000,
    progress: 100,
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mXg',
    description: 'Hiểu bản chất AI, machine learning và cách ứng dụng vào công việc hàng ngày.',
  },
];

export const mockLessons = [
  {
    id: '1',
    courseId: 'ai-mastery-pro',
    title: 'Giới thiệu: Tại sao AI là tương lai?',
    duration: '12:30',
    type: 'video',
    completed: true,
    videoId: 'dQw4w9WgXcQ',
    description: 'Tổng quan về cuộc cách mạng AI và tác động đến doanh nghiệp SME Việt Nam.',
    aiTips: [
      'AI không thay thế con người — nó khuếch đại năng lực của bạn.',
      'Bắt đầu với use case đơn giản nhất trong doanh nghiệp của bạn.',
    ],
  },
  {
    id: '2',
    courseId: 'ai-mastery-pro',
    title: 'Kiến trúc hệ thống AI hiện đại',
    duration: '18:45',
    type: 'video',
    completed: true,
    videoId: 'dQw4w9WgXcQ',
    description: 'Tìm hiểu LLM, RAG, Agent và cách chúng phối hợp với nhau.',
    aiTips: [],
  },
  {
    id: '3',
    courseId: 'ai-mastery-pro',
    title: 'Prompt Engineering nâng cao',
    duration: '22:10',
    type: 'video',
    completed: false,
    videoId: 'dQw4w9WgXcQ',
    description: 'Kỹ thuật chain-of-thought, few-shot learning và structured output.',
    aiTips: [],
  },
  {
    id: '4',
    courseId: 'ai-mastery-pro',
    title: 'Xây dựng chatbot nội bộ với RAG',
    duration: '35:20',
    type: 'video',
    completed: false,
    videoId: 'dQw4w9WgXcQ',
    description: 'Tích hợp cơ sở kiến thức doanh nghiệp vào AI assistant.',
    aiTips: [],
  },
  {
    id: '5',
    courseId: 'ai-mastery-pro',
    title: 'Automation với AI Agent',
    duration: '28:50',
    type: 'video',
    completed: false,
    videoId: 'dQw4w9WgXcQ',
    description: 'Triển khai agent tự động hóa quy trình kinh doanh.',
    aiTips: [],
  },
  {
    id: '6',
    courseId: 'ai-mastery-pro',
    title: 'Case study: Triển khai AI tại SME thực tế',
    duration: '41:00',
    type: 'video',
    completed: false,
    videoId: 'dQw4w9WgXcQ',
    description: 'Phân tích 3 doanh nghiệp Việt đã ứng dụng AI thành công.',
    aiTips: [],
  },
];

export const mockLeads = [
  {
    id: 'L001', name: 'Nguyễn Hoàng Nam', phone: '0912 345 678',
    email: 'nam.nguyen@company.vn', campaign: 'Webinar AI Agent', stage: 'new',
    paymentStatus: 'Chưa thanh toán', createdAt: '2026-06-20',
  },
  {
    id: 'L002', name: 'Trần Thị Thu Thủy', phone: '0987 654 321',
    email: 'thuy.tran@gmail.com', campaign: 'Lead Magnet Ebook', stage: 'new',
    paymentStatus: 'Chưa thanh toán', createdAt: '2026-06-20',
  },
  {
    id: 'L003', name: 'Lê Văn Phụng', phone: '0905 111 222',
    email: 'phung.le@biz.com', campaign: 'Webinar AI Agent', stage: 'new',
    paymentStatus: 'Chưa thanh toán', createdAt: '2026-06-19',
  },
  {
    id: 'L004', name: 'Phạm Minh Đức', phone: '0938 777 888',
    email: 'duc.pham@startup.io', campaign: 'Zalo Ads', stage: 'contacted',
    paymentStatus: 'Chưa thanh toán', createdAt: '2026-06-18',
  },
  {
    id: 'L005', name: 'Hoàng Lan Anh', phone: '0963 222 444',
    email: 'anh.hoang@edu.vn', campaign: 'Facebook Ads', stage: 'contacted',
    paymentStatus: 'Chưa thanh toán', createdAt: '2026-06-18',
  },
  {
    id: 'L006', name: 'Vũ Thanh Tùng', phone: '0918 333 555',
    email: 'tung.vu@tech.vn', campaign: 'Webinar AI Agent', stage: 'contacted',
    paymentStatus: 'Chưa thanh toán', createdAt: '2026-06-17',
  },
  {
    id: 'L007', name: 'Đỗ Thị Hương', phone: '0946 999 111',
    email: 'huong.do@corp.com', campaign: 'Lead Magnet Ebook', stage: 'waiting',
    paymentStatus: 'Chờ chuyển khoản', createdAt: '2026-06-17',
  },
  {
    id: 'L008', name: 'Bùi Quang Minh', phone: '0972 444 666',
    email: 'minh.bui@agency.vn', campaign: 'Facebook Ads', stage: 'waiting',
    paymentStatus: 'Chờ chuyển khoản', createdAt: '2026-06-16',
  },
  {
    id: 'L009', name: 'Ngô Thị Bích Ngọc', phone: '0901 888 777',
    email: 'ngoc.ngo@retail.vn', campaign: 'Zalo Ads', stage: 'paid',
    paymentStatus: 'Đã thanh toán', createdAt: '2026-06-15',
  },
  {
    id: 'L010', name: 'Trịnh Văn Khải', phone: '0933 666 555',
    email: 'khai.trinh@sme.vn', campaign: 'Webinar AI Agent', stage: 'paid',
    paymentStatus: 'Đã thanh toán', createdAt: '2026-06-15',
  },
  {
    id: 'L011', name: 'Lý Thị Cẩm Tú', phone: '0925 555 444',
    email: 'tu.ly@fashion.vn', campaign: 'Facebook Ads', stage: 'paid',
    paymentStatus: 'Đã thanh toán', createdAt: '2026-06-14',
  },
  {
    id: 'L012', name: 'Phan Thanh Hải', phone: '0958 111 333',
    email: 'hai.phan@logistics.vn', campaign: 'Zalo Ads', stage: 'no-need',
    paymentStatus: 'Không quan tâm', createdAt: '2026-06-13',
  },
];

export const mockPipelineStages = [
  { id: 'new', label: 'Khách mới', count: 3 },
  { id: 'contacted', label: 'Đã liên hệ', count: 3 },
  { id: 'waiting', label: 'Chờ CK', count: 2 },
  { id: 'paid', label: 'Đã thanh toán', count: 3 },
  { id: 'no-need', label: 'Không có nhu cầu', count: 1 },
];

export const mockTransactions = [
  {
    id: 'TR-942024', name: 'Nguyễn Hoàng Nam',
    course: 'AI Mastery Pro', amount: 2499000,
    status: 'paid', date: '24/05/2026', time: '14:20',
  },
  {
    id: 'TR-942023', name: 'Trần Thị Thu Thủy',
    course: 'Content AI Bot', amount: 599000,
    status: 'pending', date: '24/05/2026', time: '11:15',
  },
  {
    id: 'TR-942022', name: 'Lê Văn Phụng',
    course: 'AI Fundamentals', amount: 299000,
    status: 'failed', date: '24/05/2026', time: '09:05',
  },
  {
    id: 'TR-942021', name: 'Phạm Minh Đức',
    course: 'AI Mastery Pro', amount: 2499000,
    status: 'paid', date: '23/05/2026', time: '22:10',
  },
  {
    id: 'TR-942020', name: 'Hoàng Lan Anh',
    course: 'Data Analysis AI', amount: 1250000,
    status: 'pending', date: '23/05/2026', time: '18:45',
  },
  {
    id: 'TR-942019', name: 'Vũ Thanh Tùng',
    course: 'Generative AI Marketing', amount: 1250000,
    status: 'paid', date: '23/05/2026', time: '10:30',
  },
  {
    id: 'TR-942018', name: 'Đỗ Thị Hương',
    course: 'AI Mastery Pro', amount: 2499000,
    status: 'paid', date: '22/05/2026', time: '16:00',
  },
];

export const mockBlogPosts = [
  {
    id: 1,
    slug: 'tuong-lai-ai-trong-dao-tao',
    title: 'Tương lai của AI trong đào tạo doanh nghiệp năm 2026',
    excerpt: 'Khám phá cách các mô hình ngôn ngữ lớn đang thay đổi cách thức vận hành của các trung tâm đào tạo...',
    category: 'CÔNG NGHỆ',
    date: '12/10/2025',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhgBw1_f_LnQgv32CpZmm6GecF5vp7mjZos9_pdDxztm1enYnzWEgTjqdZvzMyYVFR-Cv61dHiJVvH-P4OnBKRQnamADQTY8kiW9BBcdkS5zQHyBgXHjB4ojAMmUgdx30aIT-xZk0gVvlIeV9XLg18iv0rChwV438CCv0VkF7vfl-U01_dFWlRB_o0_je0paVo-kx1ow8bBIw2XsEmoQr3Sj97NBhSnIPnCWM5XMzqcTF90j_FWv-z0PZrcVcdgW7ZbvSPsWoiG5E',
    author: 'HT',
    readTime: '5 phút',
    content: '<p>AI đang thay đổi cách chúng ta học tập và phát triển kỹ năng nghề nghiệp...</p>',
  },
  {
    id: 2,
    slug: 'toi-uu-thanh-toan-vietqr',
    title: 'Cách tối ưu hóa quy trình thanh toán với VietQR',
    excerpt: 'Hướng dẫn chi tiết tích hợp hệ thống thanh toán tự động cho website giáo dục trực tuyến...',
    category: 'HƯỚNG DẪN',
    date: '08/10/2025',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCET1Qe6X4V0QuJvGlq_iwyP7rTjKS7jv_tLJOkT9NMxB1iffmIaGqUqMHY1jc6YZCqamTD11JK4fXFQNGiuQrQ_Bl3C00iM6kukZ7PSg4VESZL8-MWm8qW-1dXE-DmpgP0PIGd_91iYdq3HxdzEkTa2DMR_Gd8yrFU6ZaLWsZxFWpOw0rU03ZJn13gJXUmFhSH8y-VH6roDttNoufjHOkvEJSYGn9PNwVKulOq-oi3YafAI0SMFswPq9wEYRgZveYPSNRS2m8ryo',
    author: 'HT',
    readTime: '7 phút',
    content: '<p>VietQR là giải pháp thanh toán QR code chuẩn Việt Nam, giúp đơn giản hóa quy trình thu tiền...</p>',
  },
  {
    id: 3,
    slug: 'cap-nhat-admin-dashboard-thang-10',
    title: 'Cập nhật tính năng Admin Dashboard mới tháng 10',
    excerpt: 'Hệ thống quản lý học viên vừa được bổ sung bộ lọc CRM thông minh và báo cáo giao dịch thời gian thực...',
    category: 'TIN TỨC',
    date: '05/10/2025',
    thumbnail: null,
    author: 'HT',
    readTime: '3 phút',
    content: '<p>Chúng tôi đã ra mắt phiên bản Admin Dashboard mới với nhiều tính năng cải tiến...</p>',
  },
  {
    id: 4,
    slug: 'prompt-engineering-cho-smb',
    title: '10 kỹ thuật Prompt Engineering giúp SME tăng năng suất 3x',
    excerpt: 'Những kỹ thuật prompt thực tế đã được kiểm chứng qua hàng trăm doanh nghiệp Việt Nam...',
    category: 'HƯỚNG DẪN',
    date: '01/10/2025',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhgBw1_f_LnQgv32CpZmm6GecF5vp7mjZos9_pdDxztm1enYnzWEgTjqdZvzMyYVFR-Cv61dHiJVvH-P4OnBKRQnamADQTY8kiW9BBcdkS5zQHyBgXHjB4ojAMmUgdx30aIT-xZk0gVvlIeV9XLg18iv0rChwV438CCv0VkF7vfl-U01_dFWlRB_o0_je0paVo-kx1ow8bBIw2XsEmoQr3Sj97NBhSnIPnCWM5XMzqcTF90j_FWv-z0PZrcVcdgW7ZbvSPsWoiG5E',
    author: 'HT',
    readTime: '10 phút',
    content: '<p>Prompt Engineering không chỉ là nghệ thuật viết câu lệnh — đó là cách tư duy...</p>',
  },
];

export const mockStats = {
  revenue: { value: '47.5M đ', label: 'Doanh thu tháng', change: '+12%', trend: 'up' },
  leads: { value: '128', label: 'Leads mới', change: '+8', trend: 'up' },
  orders: { value: '94', label: 'Đơn hàng', change: '+5%', trend: 'up' },
  conversion: { value: '23%', label: 'Tỉ lệ chuyển đổi', change: '-2%', trend: 'down' },
};

export const mockChartData = [
  { month: 'T1', value: 28 }, { month: 'T2', value: 35 },
  { month: 'T3', value: 32 }, { month: 'T4', value: 41 },
  { month: 'T5', value: 38 }, { month: 'T6', value: 47 },
];

export const mockCampaigns = [
  { name: 'AI Agent Webinar', leads: 48, percent: 75, color: 'bg-primary-container' },
  { name: 'Lead Magnet Ebook', leads: 35, percent: 55, color: 'bg-secondary' },
  { name: 'Facebook Ads', leads: 28, percent: 43, color: 'bg-tertiary' },
  { name: 'Zalo Ads', leads: 17, percent: 27, color: 'bg-outline' },
];
