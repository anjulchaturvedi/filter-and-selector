
  
const deletedItems = []
const hiddemItems = []
var currentList = products
console.log(products)
//adding input markup to the DOM
$(".filters").append(`<input type="text" name="" id="search_input" class="grow" />`)
$(".filters").after(`<span id="table"></span>`)
// generating the table
function renderTable(list, sel) {
    // clearing out previous markup
    $("table").remove()
    var brands = []
    var os = []
    if (sel) {
        for (let index = 0; index < products.length; index++) {
            brands.push(products[index].brand)
            os.push(products[index].os)
        }
        // removing duplicates elements
        brands = Array.from(new Set(brands))
        os = Array.from(new Set(os))
        // generating the filters dropdown
        var brandMarkup = `
        <select name="" id="brands">
        <option value="none">Select Brands</option>
        `
        for (let index = 0; index < brands.length; index++) {
            brandMarkup += `<option value="${brands[index]}">${brands[index]}</option>`
        }
        brandMarkup += `
            </select>
        `
        $('.filters').append(brandMarkup)
        var osMarkup = `
        <select name="" id="os">
        <option value="none">Select OS</option> 
        `
        for (let index = 0; index < os.length; index++) {
            osMarkup += `<option value="${os[index]}">${os[index]}</option>`
        }
        osMarkup += `
        </select>
        `
        $('.filters').append(osMarkup)
    }
    // aliginnig the filter tab to the table
    var markup = `<table>`
    markup += `
    <thead>
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Os</th>
            <th>Remove</th>
        </tr>
    </thead>
    <tbody>
        `
    for (let index = 0; index < list.length; index++) {
        markup += `<tr>
                <td>${list[index].id}</td>
                <td>${list[index].name}</td>
                <td>${list[index].brand}</td>
                <td>${list[index].os}</td>
                <td style="text-align:center;"><a href="#" data="${list[index].id}" id="hide">X</a></td>
                </tr>
                `
    }

    markup += `
    </tbody>
    </table > `
    // console.log(markup)
    $("#table").append(markup)
    $(".filters").css("width", `${$('table').width()}px`)

}
renderTable(products, true)

function getObjectByProperty(products, prop, value, negation = false, caseSensitive = true) {
    var list = []
    if (negation) {
        products.forEach(i => {
            if (!caseSensitive) {
                if (i[prop] != value) {
                    list.push(i)
                }
            }
            else {
                if (i[prop].toLowerCase().match(value.toLowerCase())) {
                    list.push(i)
                }
            }
        })
        return list

    } else {
        products.forEach(i => {
            if (!caseSensitive) {
                if (i[prop] == value) {
                    list.push(i)
                }
            }
            else {
                if (i[prop].toLowerCase().match(value.toLowerCase())) {
                    list.push(i)
                }
            }
        })
        return list
    }
}

function filterByOs(query) {
    var x = $("#brands").val()
    console.log(query)
    if (x != 'none') {
        console.log("Dependency of Brand")
        if (query != "none") {
            console.log(getObjectByProperty(getObjectByProperty(products, "brand", x), "os", query))
            currentList = getObjectByProperty(getObjectByProperty(products, "brand", x), "os", query)
            renderTable(currentList, false)
        }
        else {
            currentList = getObjectByProperty(products, "brand", x)
            renderTable(currentList, false)
        }
    }
    else {
        console.log("at 146")
        if (query != "none") {
            currentList = getObjectByProperty(products, "os", query)
            renderTable(currentList)
        }
        else {
            currentList = products
            renderTable(products, false)

        }
    }
}

function filterByBrand(query) {
    var x = $("#os").val()
    console.log(query)
    if (x != 'none') {
        console.log("Dependency of Os")
        if (query != "none") {
            console.log(getObjectByProperty(getObjectByProperty(products, "os", x), "brand", query))
            currentList = getObjectByProperty(getObjectByProperty(products, "os", x), "brand", query)
            renderTable(currentList, false)
        }
        else {
            currentList = getObjectByProperty(products, "os", x)
            renderTable(currentList, false)
        }
    }
    else {
        console.log("at 146")
        if (query != "none") {
            currentList = getObjectByProperty(products, "brand", query)
            renderTable(currentList)
        }
        else {
            currentList = products
            renderTable(products, false)

        }
    }
}

function clearFilter() {
    console.log("CLEARING OUT")
    $("#log").text("")
    for (let index = 0; index <= $('tr').length; index++) {
        if (!deletedItems.includes($(`tr:eq(${index}) td:eq(0)`).text())) {
            $(`tr:eq(${index})`).css('display', '')
        }
    }
}

$("#search_input").keyup(function () {
    var query = $(this).val()
    if (query == "") {
        if ($("#os").val() == "none" && $("#brands").val() == "none") {
            renderTable(products)
        }
        else {
            renderTable(currentList)

        }
    }
    else if (query.match(/\D/)) {
        console.log("searchign by name")
        console.log(getObjectByProperty(currentList, "name", query, false, true))
        renderTable(getObjectByProperty(currentList, "name", query, false, true))
    }
    else {
        console.log("searching by id")
        renderTable(getObjectByProperty(currentList, "id", query, false, true))
    }
})

$("#os").on("change", function () {
    var x = $(this).val()
    filterByOs(x)
})

$("#brands").on("change", function () {
    var x = $(this).val()
    filterByBrand(x)
})

$("body").on("click", "#hide", function () {
    console.log($(this).attr("data"))
    currentList = getObjectByProperty(currentList, "id", $(this).attr("data"), true, false)
    products = getObjectByProperty(currentList, "id", $(this).attr("data"), true, false)
    console.log(currentList)
    renderTable(currentList)
})