import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'

export function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="隱私權與個資告知" description="這份文字是 MVP 階段的基本告知範本，用來說清楚平台為什麼蒐集資料、如何使用，以及使用者可以怎麼要求更正或刪除。" aside={<div className="safe-aside"><strong>資料原則</strong><span>✓ 只收媒合必要資料</span><span>✓ 不公開私人聯絡方式</span><span>✓ 可要求更正或刪除</span></div>} />
      <section className="section privacy-page">
        <div className="container privacy-content">
          <article>
            <h2>一、蒐集目的</h2>
            <p>本平台為「教育平權青年專長媒合」之目的，蒐集、處理及利用使用者資料，用於任務發布、青年專長媒合、報名聯繫、服務紀錄與平台營運管理。</p>
          </article>
          <article>
            <h2>二、蒐集資料類別</h2>
            <p>可能包含姓名或暱稱、學校、身分別、科系或專長背景、可提供協助類型、自我介紹、可投入時間、聯絡方式、志工服務時數需求、任務報名原因，以及任務發布單位提供的聯絡資訊。</p>
          </article>
          <article>
            <h2>三、使用期間、地區、對象與方式</h2>
            <p>資料將於平台營運、任務媒合及必要紀錄保存期間使用。使用地區以平台服務可及範圍為主；使用對象包含平台管理者、任務發布單位與必要協作人員。私人聯絡方式不會公開顯示於任務列表或首頁。</p>
          </article>
          <article>
            <h2>四、未滿 18 歲使用者</h2>
            <p>若你未滿 18 歲，請先取得法定代理人同意後再送出表單。涉及實體活動、長期陪伴、志工時數或兒少接觸的任務，發布單位仍應依其制度另行確認安全、保護與同意流程。</p>
          </article>
          <article>
            <h2>五、使用者權利</h2>
            <p>你可以請求查詢、閱覽、更正、停止使用或刪除個人資料。MVP 階段請由平台管理者協助處理；正式營運時應提供明確聯絡窗口與處理流程。</p>
          </article>
          <article>
            <h2>六、不同意提供資料的影響</h2>
            <p>若不同意提供必要資料，仍可瀏覽公開任務，但無法完成專長登錄、任務發布或任務報名。</p>
          </article>
          <div className="privacy-actions">
            <Link className="button button-primary" to="/students/new">回到專長登錄</Link>
            <Link className="button button-ghost" to="/tasks">探索任務</Link>
          </div>
        </div>
      </section>
    </>
  )
}
