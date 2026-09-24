import { ArrowDown, ArrowUpRight, MapPin, Plane } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";
import ClickBurst from "@/components/ClickBurst";
import CometCard from "@/components/CometCard";
import ContactInput from "@/components/ContactInput";
import HeroVideo from "@/components/HeroVideo";
import NavSpecularEffect from "@/components/NavSpecularEffect";
import ProximityTitle from "@/components/ProximityTitle";
import StickerPeel from "@/components/StickerPeel";
import TextLoop from "@/components/TextLoop";
import VideoMapStop from "@/components/VideoMapStop";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

const projects = [
  {
    number: "01",
    title: "《欺诈神明》",
    english: "AI SHORT DRAMA",
    description:
      "累计播放 4590 万。负责 AI 视觉创作与视频制作，将剧情节奏转化为完整动态表达。",
    tags: ["4590万播放", "AI 视频", "短剧视觉"],
    video: "/assets/videos/fraud-gods.mp4",
    location: "45.90M VIEWS",
    className: "map-stop-one",
  },
  {
    number: "02",
    title: "《国民男神暗恋我》",
    english: "AI SHORT DRAMA",
    description:
      "累计播放 4673 万。以角色关系和情绪推进为核心，完成 AI 影像与成片制作。",
    tags: ["4673万播放", "AI 导演", "视频制作"],
    video: "/assets/videos/national-heartthrob.mp4",
    location: "46.73M VIEWS",
    className: "map-stop-two",
  },
  {
    number: "03",
    title: "《蛇后，邪帝又醋了》",
    english: "AI SHORT DRAMA",
    description:
      "累计播放 4060 万。从画面生成、镜头衔接到后期整合，构建奇幻短剧视觉氛围。",
    tags: ["4060万播放", "奇幻短剧", "动态叙事"],
    video: "/assets/videos/serpent-empress.mp4",
    location: "40.60M VIEWS",
    className: "map-stop-three",
  },
  {
    number: "04",
    title: "花样年华 · 项目经历",
    english: "SHORT DRAMA EXPERIENCE",
    description:
      "曾在花样年华参与多个项目制作；代表经历可在红果短剧搜索《听懂婴语》。",
    tags: ["项目制作", "短剧视觉", "团队协作"],
    image: "/assets/project-brand-fashion.png",
    location: "STORY TERMINAL",
    className: "map-stop-four",
  },
];

function FlowDivider({
  text,
  direction = "forward",
  ribbonColor,
  color,
  className = "",
}: {
  text: string;
  direction?: "forward" | "reverse";
  ribbonColor: string;
  color: string;
  className?: string;
}) {
  return (
    <div className={`flow-divider ${className}`.trim()}>
      <TextLoop
        text={text}
        shape="wave"
        speed={92}
        direction={direction}
        separator="✦"
        curviness={9}
        fontSize={29}
        fontWeight={900}
        letterSpacing={1.4}
        uppercase
        color={color}
        ribbon
        ribbonColor={ribbonColor}
        ribbonWidth={64}
        pauseOnHover
      />
    </div>
  );
}

function ChapterJoint({
  variant,
  previousNumber,
  previousLabel,
  nextNumber,
  nextLabel,
}: {
  variant: "work" | "strengths";
  previousNumber: string;
  previousLabel: string;
  nextNumber: string;
  nextLabel: string;
}) {
  return (
    <div
      className={`chapter-joint chapter-joint-${variant}`}
      role="separator"
      aria-label={`${previousLabel}至${nextLabel}`}
    >
      <div className="chapter-joint-bar" aria-hidden="true" />
      <div className="chapter-joint-floor" aria-hidden="true" />
      <div className="chapter-joint-tab chapter-joint-tab-previous">
        <small>{previousNumber}</small>
        <span>{previousLabel}</span>
      </div>
      <div className="chapter-joint-tab chapter-joint-tab-next">
        <small>{nextNumber}</small>
        <span>{nextLabel}</span>
      </div>
    </div>
  );
}

const strengths = [
  {
    number: "01",
    title: "品牌叙事建构",
    english: "BRAND NARRATIVE",
    description:
      "从关键词、情绪与受众出发，建立能延展到主视觉、物料和内容端的完整视觉语言。",
  },
  {
    number: "02",
    title: "AI 视觉导演",
    english: "AI ART DIRECTION",
    description:
      "不止生成单张图片，更重视角色一致性、画面控制、工作流设计与人工精修后的最终质量。",
  },
  {
    number: "03",
    title: "跨媒介交付",
    english: "CROSS-MEDIA DELIVERY",
    description:
      "兼顾平面、社媒、视频、互动界面与现场物料，让同一概念在不同屏幕与场景中保持一致。",
  },
  {
    number: "04",
    title: "从概念到落地",
    english: "CONCEPT TO DELIVERY",
    description:
      "把模糊需求拆成方向、系统与可执行清单，在创意表达和真实交付之间找到平衡。",
  },
];

export default function Home() {
  return (
    <div className="site-shell">
      <ClickBurst />
      <header className="site-nav">
        <NavSpecularEffect />
        <div className="nav-inner">
          <a className="wordmark" href="#top" aria-label="返回首页">
            DOUYOU<span>®</span>
          </a>
          <nav className="nav-links" aria-label="主导航">
            <BorderGlow className="nav-glow-item">
              <a href="#profile">关于</a>
            </BorderGlow>
            <BorderGlow className="nav-glow-item">
              <a href="#work">项目</a>
            </BorderGlow>
            <BorderGlow className="nav-glow-item">
              <a href="#strengths">能力</a>
            </BorderGlow>
          </nav>
          <a className="nav-contact" href="#contact">
            联系合作 <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <HeroVideo />
          <div className="flight-glass" aria-hidden="true" />
          <img
            className="flight-frame"
            src="/assets/airplane-window-frame-v2.png"
            alt=""
            aria-hidden="true"
          />

          <div className="hero-sticker-layer" aria-hidden="true">
            <StickerPeel
              className="hero-sticker hero-sticker-star"
              imageSrc="/assets/sticker-star-flight.png"
              width={136}
              rotate={-7}
              peelDirection={12}
            />
            <StickerPeel
              className="hero-sticker hero-sticker-cloud"
              imageSrc="/assets/sticker-cloud-plane.png"
              width={158}
              rotate={4}
              peelDirection={-10}
            />
            <StickerPeel
              className="hero-sticker hero-sticker-globe"
              imageSrc="/assets/sticker-route-globe.png"
              width={122}
              rotate={8}
              peelDirection={18}
            />
          </div>

          <div className="flight-content">
            <div className="flight-header">
              <div className="flight-mark">
                <Plane size={23} strokeWidth={2.1} />
                <strong>
                  DY
                  <br />
                  AIR
                </strong>
              </div>
              <p>DESIGNER PORTFOLIO · 2026</p>
              <span>FLIGHT NO. DY–001</span>
            </div>

            <div className="flight-title-wrap">
              <p className="flight-thats">That&apos;s</p>
              <h1 aria-label="DOUYOU">
                <span className="flight-title-line flight-title-one">
                  <i>D</i>
                  <i className="flight-letter-plane">
                    <Plane aria-hidden="true" />
                  </i>
                  <i>U</i>
                </span>
                <span className="flight-title-line flight-title-two">
                  <i>Y</i>
                  <i className="flight-letter-plane">
                    <Plane aria-hidden="true" />
                  </i>
                  <i>U</i>
                </span>
              </h1>
              <span className="flight-star flight-star-one" aria-hidden="true">
                ★
              </span>
              <span className="flight-star flight-star-two" aria-hidden="true">
                ★
              </span>
              <span className="flight-star flight-star-three" aria-hidden="true">
                ✦
              </span>
            </div>

            <div className="flight-tags" aria-label="专业身份">
              <span>VISUAL × AI DESIGN</span>
              <span>BRAND DIRECTION</span>
            </div>

            <div className="flight-manifest">
              <div>
                <small>ROLE</small>
                <strong>Visual / AI / Brand Designer</strong>
              </div>
              <div>
                <small>ROUTE</small>
                <strong>Concept → System → Delivery</strong>
              </div>
              <a href="#profile">
                <small>NEXT</small>
                <strong>
                  Explore selected work
                  <ArrowDown size={15} strokeWidth={1.7} />
                </strong>
              </a>
            </div>
          </div>
        </section>

        <FlowDivider
          text="DOUYOU / VISUAL AI / BRAND DESIGN"
          ribbonColor="#0fb8c8"
          color="#090b0c"
          className="flow-divider-one"
        />

        <section className="profile section frame" id="profile">
          <div className="section-label">
            <span>01</span>
            <p>PROFILE / 个人经历</p>
          </div>

          <div className="profile-intro">
            <h2 className="editorial-title">
              <ProximityTitle label="VISUAL STORY" annotation="about me" />
              <span className="editorial-cn">
                把复杂的创意，
                <br />
                变成清晰的视觉系统。
              </span>
            </h2>
            <p className="profile-lead">
              我叫陈宇航，是一名 AI 设计师。工作覆盖电商视觉、运营内容、IP
              设计与 AI 导演视频制作。
            </p>
          </div>

          <div className="profile-body">
            <figure className="portrait-wrap">
              <div className="badge-lanyard" aria-hidden="true">
                <span />
                <i />
              </div>
              <div className="badge-clip" aria-hidden="true" />
              <img
                src="/assets/designer-chen-yuhang.jpg"
                alt="AI 设计师陈宇航在海边手捧鲜花的个人照片"
              />
              <figcaption>
                <span><b>CHEN YUHANG</b> / AI DESIGNER</span>
                <span>CREW ID · 001 / 2026</span>
              </figcaption>
            </figure>

            <div className="profile-copy">
              <article className="profile-manifest-card" aria-label="陈宇航个人经历与专业方向">
                <header className="manifest-header">
                  <span>CREW MANIFEST</span>
                  <strong>DOUYOU AIR · PROFILE 001</strong>
                  <i>2026</i>
                </header>

                <div className="manifest-stories">
                  <section>
                    <span>01 / PASSENGER PROFILE</span>
                    <p>我用 AI 加速创意探索，也重视设计判断与最终落地。</p>
                  </section>
                  <section>
                    <span>02 / EXPERIENCE</span>
                    <p>曾在花样年华参与多个项目制作，相关作品包括可在红果短剧搜索到的《听懂婴语》。</p>
                  </section>
                  <section>
                    <span>03 / DESTINATION</span>
                    <p>从电商主图到一套 IP，再到完整视频，让每次交付既有视觉记忆点，也能真正服务内容与业务。</p>
                  </section>
                </div>

                <div className="manifest-route" aria-hidden="true">
                  <span>IDEA</span><b>→</b><span>DESIGN</span><b>→</b><span>DELIVERY</span>
                </div>
              </article>

              <div className="manifest-services" aria-label="专业方向">
                <section>
                  <span>01</span>
                  <strong>视觉与内容设计</strong>
                  <small>电商主图 / 详情页 / 运营长图</small>
                </section>
                <section>
                  <span>02</span>
                  <strong>品牌与 IP 设计</strong>
                  <small>品牌视觉 / 角色 / 场景延展</small>
                </section>
                <section>
                  <span>03</span>
                  <strong>AI 导演与视频制作</strong>
                  <small>脚本 / 分镜 / 动态成片</small>
                </section>
              </div>
            </div>
          </div>

          <div className="profile-data" aria-label="项目数据">
            <button type="button" className="profile-data-card" aria-label="陈宇航，AI 设计师">
              <strong>陈宇航</strong>
              <span>AI DESIGNER</span>
            </button>
            <button type="button" className="profile-data-card" aria-label="四个核心服务方向">
              <strong>04</strong>
              <span>核心服务方向</span>
            </button>
            <button type="button" className="profile-data-card" aria-label="二维视觉与动态设计协同">
              <strong>2D + MOTION</strong>
              <span>静态与动态协同</span>
            </button>
            <button type="button" className="profile-data-card" aria-label="从 AI 创意到完整交付">
              <strong>AI → DELIVERY</strong>
              <span>从创意到完整交付</span>
            </button>
          </div>
        </section>

        <ChapterJoint
          variant="work"
          previousNumber="01"
          previousLabel="PROFILE / 个人经历"
          nextNumber="02"
          nextLabel="SELECTED WORK / 精选项目"
        />

        <section className="work section" id="work">
          <div className="frame">
            <div className="work-heading">
              <h2 className="editorial-title">
                <ProximityTitle label="SELECTED WORK" annotation="project edit" />
                <span className="editorial-cn">少而准确的作品，胜过堆叠。</span>
              </h2>
              <p>
                把不同类型的作品变成沿途停靠的设计站点。沿着路线查看我的服务方向与项目经历。
              </p>
            </div>

            <div className="work-map-desk">
              <span className="desk-ticket" aria-hidden="true">CHEN YUHANG / BOARDING PASS</span>
              <div className="work-map" aria-label="陈宇航作品地图">
                <div className="map-folds" aria-hidden="true" />
                <div className="map-city" aria-hidden="true">
                  <span className="map-city-label">CREATIVE CITY MAP</span>
                  <strong>AI<br />DESIGN<br />ROUTE</strong>
                  <small>CHEN YUHANG / SELECTED WORK</small>
                </div>
                <div className="map-route-band" aria-hidden="true">
                  <Plane size={18} strokeWidth={2.5} />
                  <span>IDEA — IMAGE — MOTION — DELIVERY</span>
                </div>
                <div className="map-heading">
                  <span>AI DESIGN ROUTE · 2026</span>
                  <strong>陈宇航的作品航线</strong>
                  <small>FROM IDEA TO VISUAL DESTINATION</small>
                </div>
                <svg className="map-route" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M100 360 C220 130 340 150 440 300 S650 450 735 245 S940 80 1100 235" />
                  <circle cx="100" cy="360" r="13" />
                  <circle cx="440" cy="300" r="13" />
                  <circle cx="735" cy="245" r="13" />
                  <circle cx="1100" cy="235" r="13" />
                </svg>
                {projects.map((project) => (
                  "video" in project ? (
                    <VideoMapStop project={project} key={project.number} />
                  ) : (
                  <article className={`map-stop ${project.className}`} key={project.number}>
                    <CometCard
                      className="map-photo-comet"
                      ariaLabel={`${project.title}项目展示，移动鼠标查看立体效果`}
                    >
                      <div className="map-photo">
                        <img src={project.image} alt={project.title + "项目视觉"} />
                        <span>{project.number}</span>
                      </div>
                    </CometCard>
                    <div className="map-copy">
                      <p><MapPin size={14} strokeWidth={2.4} /> {project.location}</p>
                      <h3>{project.title}</h3>
                      <small>{project.description}</small>
                      <ul aria-label="项目类别">
                        {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                      </ul>
                    </div>
                  </article>
                  )
                ))}
                <div className="map-legend" aria-hidden="true">
                  <span>START / AI DESIGN</span>
                  <span>NO. 100% ORIGINAL ROUTE</span>
                  <span>✦ KEEP EXPLORING</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ChapterJoint
          variant="strengths"
          previousNumber="02"
          previousLabel="SELECTED WORK / 精选项目"
          nextNumber="03"
          nextLabel="CAPABILITIES / 个人优势"
        />

        <section className="strengths section frame" id="strengths">
          <div className="strengths-heading">
            <h2 className="editorial-title">
              <ProximityTitle label="DESIGN POWER" annotation="capabilities" />
              <span className="editorial-cn">
                不是更多工具，
                <br />
                而是更完整的判断。
              </span>
            </h2>
            <p>
              把视觉策略、AI 生成、人工设计与真实交付放进同一个流程里，减少概念与成品之间的损耗。
            </p>
          </div>

          <div className="strength-grid">
            {strengths.map((item) => (
              <article className="strength-card" key={item.number}>
                <div className="strength-card-top">
                  <span>{item.number}</span>
                  <ArrowUpRight size={18} strokeWidth={1.35} />
                </div>
                <div>
                  <p>{item.english}</p>
                  <h3>{item.title}</h3>
                  <div className="strength-rule" />
                  <small>{item.description}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FlowDivider
          text="CONCEPT TO DELIVERY / LET'S MAKE IT VISIBLE"
          direction="reverse"
          ribbonColor="#a9ef26"
          color="#090b0c"
          className="flow-divider-four"
        />

        <section className="contact" id="contact">
          <div className="contact-orbit" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="contact-collage" aria-hidden="true">
            <span className="contact-collage-word">AI / VISUAL / MOTION</span>
            <span className="contact-collage-card">PORTFOLIO<br />ARCHIVE 2026</span>
            <img className="contact-collage-star" src="/assets/sticker-star-flight.png" alt="" />
            <img className="contact-collage-plane" src="/assets/sticker-cloud-plane.png" alt="" />
          </div>
          <div className="contact-content frame">
            <div className="section-label contact-label">
              <span>04</span>
              <p>CONTACT / 联系合作</p>
              <b>LAST UPDATED · 2026</b>
            </div>

            <div className="contact-sitebar">
              <strong>DOUYOU.SPACE</strong>
              <p>AI DESIGN&nbsp; | &nbsp;BRAND&nbsp; | &nbsp;MOTION</p>
              <span><i /> AVAILABLE</span>
            </div>

            <div className="contact-main">
              <div className="contact-copy">
                <p className="contact-kicker">有一个值得被看见的想法？</p>
                <PointerHighlight className="contact-title-highlight">
                  <h2 className="contact-title">
                    LET&apos;S MAKE
                    <br />
                    IT <span>VISIBLE.</span>
                    <i aria-hidden="true">let&apos;s talk</i>
                  </h2>
                </PointerHighlight>
                <p className="contact-note">
                  陈宇航 · AI 设计师
                  <br />
                  欢迎电商视觉、IP 设计、AI 视频制作与长期合作。
                </p>
                <ContactInput />
              </div>

              <CometCard
                className="contact-comet"
                ariaLabel="陈宇航 AI 设计师个人名片"
              >
                <div className="contact-comet-card">
                  <div className="contact-comet-image">
                    <img
                      loading="lazy"
                      src="/assets/designer-chen-yuhang.jpg"
                      alt="陈宇航个人照片"
                    />
                    <span>AVAILABLE<br />FOR PROJECTS</span>
                  </div>
                  <div className="contact-comet-meta">
                    <div>
                      <strong>CHEN YUHANG</strong>
                      <small>AI DESIGNER</small>
                    </div>
                    <b>#2026</b>
                  </div>
                </div>
              </CometCard>
            </div>

            <div className="contact-bottom">
              <a className="contact-action" href="#top">
                返回顶部 <ArrowUpRight size={20} strokeWidth={1.5} />
              </a>
              <div className="contact-channels" id="contact-details">
                <p>
                  <span>PHONE</span>
                  <a href="tel:18327642059">183 2764 2059</a>
                </p>
                <p>
                  <span>EMAIL</span>
                  <a href="mailto:josonmichon@gmail.com">josonmichon@gmail.com</a>
                </p>
                <p>
                  <span>WECHAT</span>
                  <strong>chenyeaaa1</strong>
                </p>
              </div>
              <p className="copyright">© 2026 DOUYOU DESIGN</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
