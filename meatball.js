(function () {
  window.addEventListener("load", function () {
    getListItems();
  });

  //On change, adds functionality
  window.addEventListener("hashchange", function () {
    //getListItems();
  });

  //Entry Point and General Function
  function meatball(colors, status, table, values) {
    console.log("colors:", colors, "\nstatus:", status, "\nvalues:", values);
    var overrides = [
      { color: "green", text: "up" },
      { color: "red", text: "down" },
      { color: "yellow", text: "degraded" },
    ];
    console.log(table.childNodes);
    if (!table || table.childNodes.length === 0) return;

    //Step 1. Choices to apply across all solutions in sharepoint.
    if (window.hasOwnProperty("overrides")) {
      defaults = values.concat(overrides);
      var uniqueObject = values.reduce(function (a, b) {
        a[b.color] = b.text;
        return a;
      }, {});
      defaults = Object.keys(uniqueObject).map(function (key) {
        return { color: key, text: uniqueObject[key] };
      });
    }

    var choiceText = values.map(function (a) {
      return a;
    });

    //Step 3. Iterate over each cell and compare the inner text to the list of known defaults.
    var rows = [].slice.call(table.getElementsByTagName("tr"));
    var thead = [].slice.call(table.getElementsByTagName("th"));

    rows.map(function (row) {
      var cells = [].slice.call(row.getElementsByTagName("td"));

      if (cells.length > 0) {
        //this checks if the cell contains the text which is in userCHoices, select that cell to add the modal
        cells.map(function (cell, ci) {
          var pos = choiceText.filter((a) =>
            a.includes(cell.innerText.trim().toLowerCase())
          );
          var add = false;
          if (pos < 0) return;
          if (thead[ci])
            [].slice.call(thead[ci].children).forEach((item, i) => {
              [].slice.call(item.children).forEach((item, i) => {
                if (item.innerText) {
                  add = containsString(item.innerText, "status");
                }
              });
            });

          if (add && table.getAttribute("id") && row.getAttribute("iid")) {
            return new addPopover(
              cell,
              values,
              row.getAttribute("iid").split(",")[1],
              thead[ci],
              table.getAttribute("id").substring(1, 37)
            );
          }
        });
      }
    });
  }

  /* get all the choices and send to main func*/
  function getListItems() {
    var scriptAjax = document.createElement("script");
    scriptAjax.type = "text/javascript";
    scriptAjax.src =
      "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
    document.body.appendChild(scriptAjax);
    //Waits till Ajax loads to allow full functionality of
    scriptAjax.onload = function () {
      //Step 1. Get all the tables -- create array
      var tables = [].slice.call(document.getElementsByTagName("table"));
      if (errorChecking(tables)) {
        console.log("No Tables Found");
        return;
      }
      //Include only the actual lists
      tables = tables.filter(function (table) {
        return table.getAttribute("class") === "ms-listviewtable";
      });
      //Grabbing the list url
      var site = _spPageContextInfo.webServerRelativeUrl;
      //Iterate through the

      tables.forEach(function (table, index) {
        var currentListName = table.getAttribute("id").substring(1, 37);
        var listName = "SP.Data." + table.summary + "ListItem";
        var data = {
          __metadata: { type: listName },
        };
        var url =
          "https://" +
          window.location.hostname +
          site +
          "/_api/web/lists('" +
          currentListName +
          "')/fields";

        $.ajax({
          url: url,
          type: "GET",
          headers: {
            Accept: "application/json; odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            credentials: true,
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
          },
          success: function (data) {
            if (data && data.d) {
              var popoverData = data.d.results.reduce(
                function (acc, cv, ci, data) {
                  var add = true;
                  if (containsString(cv.Title, "status")) {
                    if (containsString(cv.Title, "value")) {
                      acc.value = cv.Choices.results;
                      add = false;
                    }
                    if (containsString(cv.Title, "color")) {
                      acc.color = cv.Formula;
                      add = false;
                    }
                    if (add && cv.Formula) {
                      acc.status = cv.Formula;
                    }
                  }
                  return acc;
                },
                {
                  status: "",
                  color: "",
                  value: "",
                }
              );

              meatball(
                popoverData.color,
                popoverData.status,
                table,
                popoverData.value
              );
            } else meatball([]);
            return false;
          },
          error: function (error) {
            console.log("Error: Get list choices request Failed.");
          },
        });
      });
    };
  }

  /*
    This creates the popover for each cell
  */
  function addPopover(target, defaults, rowIndex, thead, table) {
    //Create Popover Ele:ment
    var popover = document.createElement("div");
    popover.style.backgroundColor = "#d3d3d3";
    popover.style.color = "#fff";
    popover.style.padding = ".5rem";
    popover.style.border = "1px solid black";
    popover.style.borderRadius = ".25rem";
    popover.style.fontWeight = "bold";
    popover.style.zIndex = "1";

    //Create Header Element
    var header = document.createElement("div");
    header.style.padding = ".25rem";
    header.style.borderRadius = ".25rem";
    header.style.textAlign = "center";
    header.style.cursor = "pointer";
    header.style.marginBottom = ".25rem";
    header.style.backgroundColor = "#4b6ac6";
    header.innerText = target.innerText;

    //Create Options Panel Element
    var options = document.createElement("div");
    options.style.display = "none";
    options.style.padding = ".25rem";
    options.style.backgroundColor = "#60605f";
    options.style.borderRadius = ".25rem";

    //Create and Add Option Elements
    defaults.forEach(function (ele, index) {
      var optionPanel = document.createElement("div");
      optionPanel.style.padding = ".25rem";
      optionPanel.style.marginBottom = ".25rem";
      optionPanel.style.cursor = "pointer";
      optionPanel.style.textAlign = "left";
      optionPanel.style.fontWeight = "bold";
      optionPanel.style.borderRadius = ".25rem";

      var option = document.createElement("div");
      option.innerText = ele;
      option.style.marginLeft = ".25rem";
      option.style.display = "inline";
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.style.margin = "0px";
      radio.style.cursor = "pointer";
      radio.style.display = "inline";

      if (compareString(target.innerText, ele)) {
        option.style.color = "black";
        optionPanel.style.backgroundColor = ele.color;
        radio.checked = "checked";
      } else {
        option.style.color = ele.color;
        optionPanel.style.backgroundColor = "#a9a9a9";
      }
      optionPanel.appendChild(radio);
      optionPanel.appendChild(option);
      //Add Click Event to update list
      optionPanel.addEventListener("click", function () {
        updateMeatball(ele, rowIndex, thead.innerText, table);
      });
      options.appendChild(optionPanel);
    });

    //Add Header Element
    popover.appendChild(header);
    //Add Options Panel
    popover.appendChild(options);

    //Add Click Event to display Options Panel
    header.addEventListener("click", function () {
      var style = options.style.display;
      var change = false;
      change = style === "block";
      change
        ? (options.style.display = "none")
        : (options.style.display = "block");
    });

    //Used addEventListener versus onmouseenter = function due to concerns of
    //overriding other scripts
    //Add Mouse Enter Event to display
    target.addEventListener("mouseover", function () {
      document.body.appendChild(popover);

      popover.style.position = "fixed";
      popover.style.left = target.getBoundingClientRect().left + "px";
      popover.style.top = target.getBoundingClientRect().top + "px";
    });

    // let timer = null;
    target.addEventListener("mouseout", function (e) {
      // clearTimeout(timer);
      // timer = setTimeout(function () {
      if (popover.contains(e.relatedTarget)) return;
      if (popover) popover.parentNode.removeChild(popover);
      // }, 50);
    });

    //Add Mouse leave Event to hide
    popover.addEventListener("mouseleave", function () {
      options.style.display = "none";
      if (popover) popover.parentNode.removeChild(popover);
    });
  }

  function updateMeatball(ele, rowIndex, header, table) {
    console.log("ele in updateMeatball", ele);
    var site = _spPageContextInfo.webServerRelativeUrl;
    var currentListName = ctx.ListTitle;
    var listName = "SP.ListItem";
    var data = {
      __metadata: { type: listName },
      status_value: ele,
    };
    var url =
      "https://eis.usmc.mil" +
      site +
      "/_api/web/lists('" +
      table +
      "')/items(" +
      rowIndex +
      ")?$select=status_value";
    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(data),
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        credentials: true,
        "If-Match": "*",
        "X-HTTP-Method": "MERGE",
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      },
      success: function (data) {
        alert("Updated Meatball Successfully");
        location.reload();
        return false;
      },
      error: function (error) {
        alert(
          "Error: Update Request Failed. Please Contact the 1MEF IMO",
          console.log(JSON.stringify(error))
        );
      },
    });
  }
  //True, error.  False, no error.
  function errorChecking(obj) {
    if (!obj) {
      console.error("Undefined");
      return true;
    }

    if (obj.length === 0) {
      console.error("Nothing in the array");
      return true;
    }

    return false;
  }

  function containsString(s0, s1) {
    return s0.trim().toLowerCase().includes(s1.trim().toLowerCase());
  }

  function compareString(s0, s1) {
    return s0.trim().toLowerCase() === s1.trim().toLowerCase();
  }
})();
