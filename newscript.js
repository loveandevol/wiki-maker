// 드래그 정렬 초기화
new Sortable(document.getElementById("field-list"), {
  animation: 150,
  handle: ".field-row"
});

// 항목 추가 버튼 동작
function addField() {
  const list = document.getElementById("field-list");
  const row = document.createElement("div");
  row.className = "field-row";
  row.innerHTML = `
    <input class="field-name" placeholder="항목명" />
    <input class="field-value" placeholder="내용" />
  `;
  list.appendChild(row);
}

// 코드 생성
function generateHTML() {
  const color = document.getElementById("mainColorPicker").value;
  const name = document.getElementById("charName").value.trim();
  const jpSurname = document.getElementById("jpSurname").value.trim();
  const jpSurnameFuri = document.getElementById("jpSurnameFurigana").value.trim();
  const jpName = document.getElementById("jpName").value.trim();
  const jpNameFuri = document.getElementById("jpNameFurigana").value.trim();
  const enName = document.getElementById("enName").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const copyright = document.getElementById("copyright").value.trim();

  // 일본어 이름 구성
  let rubyBlock = '';
  if (jpSurname || jpName) {
    rubyBlock += jpSurname ? `<ruby>${jpSurname}<rt>${jpSurnameFuri}</rt></ruby>` : '';
    rubyBlock += jpSurname && jpName ? '　' : '';
    rubyBlock += jpName ? `<ruby>${jpName}<rt>${jpNameFuri}</rt></ruby>` : '';
  }

  // ｜ 이후 이름 구성 (필요할 때만)
  let pipeName = '';
  if ((jpSurname || jpName) && enName) {
    pipeName = ` ｜ ${enName}`;
  } else if (!jpSurname && !jpName && enName) {
    pipeName = `${enName}`;
  }

  // 항목 리스트 처리
  const rows = document.querySelectorAll(".field-row");
  let detailRows = '';
  rows.forEach(row => {
    const field = row.querySelector(".field-name").value.trim();
    const value = row.querySelector(".field-value").value.trim();
    if (field && value) {
      detailRows += `<tr><td class="wt-color">${field}</td><td class="wt-detail">${value}</td></tr>\n`;
    }
  });

  const indexHTML = generateIndexHTML();
  // 최종 HTML 조합
  const bodyHTML = generateBodyHTML();

const fullHTML = `
<div id="wikiwrap">
  <style>
    .wiki-main-table, .wt-name, .wt-color {
      --wikimaincolor: ${color};
    }
  </style>
  <table class="wiki-main-table">
    <tbody>
      <tr>
        <td class="wt-name" colspan="2">
          <b><span style="font-size: 20px;">${name}</span></b><br />
          <b><span style="font-size: 13px; line-height: 180%;">${rubyBlock}${pipeName}</span></b>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 0;">
          <div style="text-align: center;">
            <img src="${imageUrl}" width="100%" />
          </div>
        </td>
      </tr>
      ${copyright ? `<tr><td class="wt-copyright" colspan="2">${copyright}</td></tr>` : ''}
      ${detailRows}
    </tbody>
  </table>

  ${indexHTML}

  ${bodyHTML}
</div>
`.trim();


    document.getElementById("output").value = fullHTML;
    document.getElementById("preview").innerHTML = fullHTML;
}

// 코드 복사 기능
function copyCode() {
  const code = document.getElementById("output");
  code.select();
  document.execCommand("copy");
  alert("코드가 복사되었습니다!");
}

document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab;

    // 버튼 active 상태 갱신
    document.querySelectorAll(".tab-button").forEach(btn => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    // 탭 콘텐츠 보여주기/숨기기
    document.querySelectorAll(".tab-content").forEach(tab => {
      tab.classList.add("hidden");
    });
    document.getElementById("tab-" + selectedTab).classList.remove("hidden");
  });
});

//본문 탭

new Sortable(document.getElementById("title-blocks"), {
  animation: 150,
  handle: ".title-entry"
});

// 제목 추가 함수 
document.getElementById("add-title-button").addEventListener("click", addTitleBlock);

function addTitleBlock() {
  const block = document.createElement("div");
  block.className = "title-entry";
  block.innerHTML = `
    <div class="title-meta">
      <div class="title-level">
  <label class="level-option">
    <input type="radio" name="level-${Date.now()}" value="1" checked />
    <span class="level-box level-1">대</span>
  </label>
  <label class="level-option">
    <input type="radio" name="level-${Date.now()}" value="2" />
    <span class="level-box level-2">중</span>
  </label>
  <label class="level-option">
    <input type="radio" name="level-${Date.now()}" value="3" />
    <span class="level-box level-3">소</span>
  </label>
</div>

      <input class="title-text" placeholder="제목 텍스트를 입력하세요" />
    </div>
    <div class="content-extra"></div>
    <div class="content-buttons">
      <button onclick="addContent(this, 'text')">본문</button>
      <button onclick="addContent(this, 'quote')">대사</button>
      <button onclick="addContent(this, 'quote2')">대사2</button>
      <button onclick="addContent(this, 'warn')">주의 박스</button>
    </div>
    <span class="title-delete" onclick="this.closest('.title-entry').remove()"><i class="fa-solid fa-trash"></i></span>
  `;
  document.getElementById("title-blocks").appendChild(block);

  new Sortable(block.querySelector(".content-extra"), {
    animation: 150,
    handle: ".content-block"
  });
}

// 하위 콘텐츠 추가 함수
function addContent(button, type) {
  const container = button.closest(".title-entry").querySelector(".content-extra");
  const block = document.createElement("div");
  block.className = "content-block";

  if (type === "text") {
    block.innerHTML = `
      <div class="content-editor text1" contenteditable="true" data-placeholder="본문 내용을 입력하세요"></div>
      <div class="block-controls">
        <button disabled>주석</button>
        <button disabled>출처</button>
      </div>
      <span class="content-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></span>
    `;
    } else if (type === "quote") {
    // block.innerHTML = `
    //   <table class="wiki-quote"><tbody><tr><td class="text1" contenteditable="true">대사 내용을 입력하세요</td></tr></tbody></table>
    //   <span class="content-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></span>
    // `;
    block.innerHTML = `
    <div class="quote-color">
        <label style="font-size: .9em;">색상:</label>
        <input type="color" class="quote-color-picker" value="#c1cfa1" />
    </div>
    <table class="wiki-quote"><tbody><tr>
    <td class="text1" contenteditable="true">대사 내용을 입력하세요</td>
    </tr></tbody></table>
    <span class="content-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></span>
    `;

    } else if (type === "quote2") {
    block.innerHTML = `
      <div class="quote-color">
        <label style="font-size: .9em;">색상:</label>
        <input type="color" class="quote-color-picker" value="#c1cfa1" />
      </div>
      <table class="wiki-quote"><tbody><tr><td class="text1">
        <div contenteditable="true" class="quote2-dialog">대사2 내용을 입력하세요</div>
        <hr />
        <div contenteditable="true" class="quote2-desc">이름/장면 등</div>
      </td></tr></tbody></table>
      <input type="text" class="quote2-link" placeholder="링크를 입력하세요 (선택)" />
      <span class="content-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></span>
    `;

} else if (type === "warn") {
    block.innerHTML = `
      <table class="text1" style="border-collapse: collapse; width: 100%; border: 1px solid #dddddd;" data-ke-align="alignLeft">
        <tbody><tr><td style="width: 100%; border: 1px solid gray; border-top: 5px solid orange; padding: 12px;">
        <span style="font-size: 1.3em;">이 문서에</span> 
        <a style="color: #0275d8; font-size: 1.3em;" href="https://namu.wiki/w/%EC%8A%A4%ED%8F%AC%EC%9D%BC%EB%9F%AC" target="_blank" rel="noopener">스포일러</a>
        <span style="font-size: 1.3em;">가 포함되어 있습니다.</span><br /><br />
        이 문서가 설명하는 작품이나 인물 등에 대한 줄거리, 결말, 반전 요소 등을 직·간접적으로 포함하고 있습니다.
        </td></tr></tbody>
      </table>
      <span class="content-delete" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash"></i></span>
    `;
  }

  container.appendChild(block);
}

function generateBodyHTML() {
  const titles = document.querySelectorAll(".title-entry");
  let bodyHTML = "";

  let h1Index = 0, h2Index = 0, h3Index = 0;

  titles.forEach(title => {
    const level = title.querySelector('input[type="radio"]:checked').value;
    const text = title.querySelector(".title-text").value.trim();
    const contents = title.querySelectorAll(".content-block");

    if (level === "1") {
      h1Index++;
      h2Index = h3Index = 0;
    } else if (level === "2") {
      h2Index++;
      h3Index = 0;
    } else if (level === "3") {
      h3Index++;
    }

    const indexText = level === "1" ? `${h1Index}.` :
                      level === "2" ? `${h1Index}.${h2Index}` :
                      `${h1Index}.${h2Index}.${h3Index}`;
    const anchor = `목차${indexText.replace(/\./g, "-")}`;

    const headingClass = level === "1" ? "wiki-h1" : level === "2" ? "wiki-h2" : "wiki-h3";
    const iconClass = level === "1" ? "wiki-h1-icon" : level === "2" ? "wiki-h2-icon" : "wiki-h3-icon";

    bodyHTML += `<details open><summary class="text1"><h2 class="${headingClass}"><span class="${iconClass}"><ion-icon name="chevron-down-outline"></ion-icon></span> <b><a name="${anchor}"></a><a href="#목차">${indexText}</a> ${text}</b></h2></summary>\n`;

    contents.forEach(block => {
        if (block.querySelector(".content-editor")) {
            // 본문
        const text = block.querySelector(".content-editor").innerHTML;
        bodyHTML += `<p class="text1">${text}</p>\n`;

        }else if (block.querySelector(".quote2-dialog")) {
  const dialog = block.querySelector(".quote2-dialog")?.innerHTML || "";
  const desc = block.querySelector(".quote2-desc")?.innerHTML || "";
  const link = block.querySelector(".quote2-link")?.value.trim();
  const color = block.querySelector(".quote-color-picker")?.value || "#c1cfa1";

  const linkPart = link
    ? `<a class="text1" href="${link}" target="_blank">${desc}</a>`
    : desc;

  bodyHTML += `
<table class="wiki-quote"><tbody><tr><td class="text1" style="border-left: 5px solid ${color};">
${dialog}
<hr />
${linkPart}
</td></tr></tbody></table>\n`;
        // } else if (block.querySelector(".quote2-dialog")) {
        //     // ✅ 대사2 처리
        // const dialog = block.querySelector(".quote2-dialog")?.innerHTML || "";
        // const desc = block.querySelector(".quote2-desc")?.innerHTML || "";
        // const link = block.querySelector(".quote2-link")?.value.trim();

        // const linkPart = link
        // ? `<a class="text1" href="${link}" target="_blank">${desc}</a>`
        // : desc;

        // bodyHTML += `
        // <table class="wiki-quote"><tbody><tr><td class="text1">
        // ${dialog}
        // <hr />
        // ${linkPart}
        // </td></tr></tbody></table>\n`;
        // } else if (block.querySelector(".wiki-quote")) {
        // // 대사1 처리
        // const td = block.querySelector("td");
        // bodyHTML += `<table class="wiki-quote"><tbody><tr><td class="text1">${td.innerHTML}</td></tr></tbody></table>\n`;
        // }
        } else if (block.querySelector(".wiki-quote") && block.querySelector(".quote-color-picker")) {
          const td = block.querySelector("td");
          const color = block.querySelector(".quote-color-picker").value;
          bodyHTML += `<table class="wiki-quote"><tbody><tr><td class="text1" style="border-left: 5px solid ${color};">${td.innerHTML}</td></tr></tbody></table>\n`;
        }

        else if (block.querySelector('td[style*="border-top: 5px solid orange"]')) {
            const warnTable = block.querySelector("table").outerHTML;
            bodyHTML += `${warnTable}\n`;
        }
    });

    bodyHTML += `</details>\n`;


  });
return bodyHTML;
}

function generateIndexHTML() {
  const titles = document.querySelectorAll(".title-entry");
  let h1Index = 0, h2Index = 0, h3Index = 0;

  let indexHTML = `
<table class="wiki-index">
<tbody>
<tr style="padding: 0 20px;">
<td style="width: 100%; margin-left: 5px; padding: 12px 20px 18px 20px; font-size: .95rem; line-height: 1.5;">
<a name="목차"></a><span style="font-size: 1.25em; margin-left: -5px;">목차</span><br />
`;

  titles.forEach(title => {
    const level = title.querySelector('input[type="radio"]:checked')?.value;
    const text = title.querySelector(".title-text")?.value.trim() || "";

    if (!text) return;

    if (level === "1") {
      h1Index++;
      h2Index = h3Index = 0;
    } else if (level === "2") {
      h2Index++;
      h3Index = 0;
    } else if (level === "3") {
      h3Index++;
    }

    const indexText =
      level === "1" ? `${h1Index}.` :
      level === "2" ? `${h1Index}.${h2Index}` :
      `${h1Index}.${h2Index}.${h3Index}`;

    const anchor = `목차${indexText.replace(/\./g, "-")}`;
    const indent = level === "1" ? 0 : level === "2" ? 20 : 40;

    indexHTML += `<a style="padding-left: ${indent}px;" href="#${anchor}">${indexText}</a> ${text}<br />\n`;
  });

  indexHTML += `</td></tr></tbody></table>`;
  return indexHTML;
}

// 접기 버튼
// function toggleContent(button) {
//   const block = button.closest(".content-block");
//   const toggleIcon = button.querySelector("i");

//   const targets = block.querySelectorAll(
//     ".content-editor, .wiki-quote, .quote2-content, table.text1"
//   );

//   targets.forEach(el => {
//     if (el.style.display === "none") {
//       el.style.display = "";
//       toggleIcon.classList.remove("fa-chevron-down");
//       toggleIcon.classList.add("fa-chevron-up");
//     } else {
//       el.style.display = "none";
//       toggleIcon.classList.remove("fa-chevron-up");
//       toggleIcon.classList.add("fa-chevron-down");
//     }
//   });
// }
