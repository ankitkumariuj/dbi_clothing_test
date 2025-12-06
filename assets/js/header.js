const loadCategoryBar = async () => {
  await $.ajax({
    url: API_URL,
    method: "POST",
    data: { type: "loadcategoryBar" },
    success: async function (response) {
      if (response.status !== false) {
        const withSub = [];
        const withoutSub = [];

        response.forEach((item) => {
          if (item.subcategories) {
            const cleanedSubcategories = [
              ...new Set(item.subcategories.split(",").map((s) => s.trim())),
            ];

            if (cleanedSubcategories.length >= 2) {
              withSub.push({
                c_name: item.c_name,
                subcategories: cleanedSubcategories,
                cat_id: item.s_id,
              });
            }
          } else {
            // for categories with no subcategory
            withoutSub.push({
              c_name: item.name,
              subcategories: [],
              cat_id: item.id,
            });
          }
        });

        const finalData = [...withSub.slice(0, 2), ...withoutSub.slice(0, 6)];

        let cat_container;
        let constant_item;
        let final_html = "";

        const isDesktop = window.innerWidth >= 1080;

        if (isDesktop) {
          cat_container = $(".menu");
          constant_item = `
            <a href="home.html" class="menu-item">Home</a>
            <a href="category.html" class="menu-item">Shop</a>
          `;
          let finalData2 = finalData.slice(0, 8);

          finalData2.forEach((item) => {
            final_html += `
                <a href="category.html?cat_id=${item.cat_id}" class="menu-item">${item.c_name}</a>
                
              `;
          });
        } else {
          // Mobile View
          cat_container = $(".sidebar-ul");
          constant_item = `
            <li><a href="home.html">Home</a></li>
            <li><a href="category.html">Shop</a></li>
          `;
          let finalData2 = finalData.slice(0, 8);
          finalData2.forEach((item) => {
            final_html += `
                <li>
                  <a href="category.html">${item.c_name}</a>
                </li>
              `;
          });
        }

        cat_container.html("");
        cat_container.html(`
                    ${constant_item}
                    ${final_html}
                 `);

        if (location.href.includes("category.html")) {
          let cat_nameLi = ` <li onclick="loadProductsByCategory('all','sideurl')">All</li>`;
          const categoryList = $("#category-list");
          let MainCategoryList = await GetMainCategory();
          MainCategoryList.forEach((item) => {
            cat_nameLi += `
            <li onclick="loadProductsByCategory('${item.id}','sideurl')">${item.name}</li>
            `;
          });
          categoryList.html(cat_nameLi);
        }

        if (location.href.includes("home.html")) {
          const bestSellerFilterByCategory = $("#bestSellerFilterByCategory");
          let bestSellerHtml = "";
          // finalData.forEach((item) => {
          //   bestSellerHtml += `
          //     <div onclick="filterBycategory('cat_id','${item.cat_id}')" class="tab">${item.c_name}</div>
          //   `;
          // });
          bestSellerFilterByCategory.html(`
             <div onclick="filterBycategory('top-20')" class="tab active">Top 20</div>
             ${bestSellerHtml}
            `);
        }
      }
    },
  });
};

loadCategoryBar();



// category fetch for search bar 
const searchcategorys = () => {
    $.ajax({
        url: API_URL,
        method: "POST",
        dataType: "json",
        data: { type: "fetchCategory" },
        success: function(res) {
            
            if (Array.isArray(res) && res.length > 0) {
                let options = '<option value="">Categories</option>';

                res.forEach(function(cat) {
                    options += `<option value="${cat.id}">${cat.name}</option>`;
                });

                $(".search-category").html(options);
            }
        }
    });
};

function goToCategory(selectEl) {
    const categoryId = selectEl.value;
    if (categoryId) {
        window.location.href = "category.html?cat_id=" + categoryId;
    }
} 
