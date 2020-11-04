(function () {
  window.addEventListener("load", function () {
    getListItems();
  });

  //On change, adds functionality
  window.addEventListener("hashchange", function () {
    getListItems();
  });
  function buildScript(source) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = source;
    document.body.appendChild(script);
    return script;
  }
  /* get all the choices and send to main func*/
  function getListItems() {
    var scripts = [
      "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
      "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
    ].map(buildScript);
    console.log(scripts);
    scripts[0].onload = function () {
      //Waits till Ajax loads to allow full functionality of
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

      var axios = require;

      //Iterate through the table
      tables.forEach(function (table, index) {
        var currentListName = table.getAttribute("id").substring(1, 37);
        var root = ctx.HttpRoot;
        var listName = "SP.Data." + table.summary + "ListItem";
        var data = {
          __metadata: { type: listName },
        };
        var url = root + "/_api/web/lists('" + currentListName + "')/fields";
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
                      if (acc.value.indexOf(cv.Choices.results) < 0) {
                        acc.value.push(cv.Choices.results);
                        add = false;
                      }
                      if (acc.value.indexOf(cv.InternalName) < 0) {
                        acc.internalColumn.push(cv.InternalName);
                        add = false;
                      }
                    }
                    if (add && cv.Formula) {
                      var column = parseFormulaColumn(cv.Formula);
                      if (column.indexOf("[") > -1) {
                        column = column.substring(1, column.length - 1);
                      }
                      if (acc.externalColumn.indexOf(column) < 0) {
                        acc.externalColumn.push(column);
                      }
                    }
                  }
                  return acc;
                },
                {
                  externalColumn: [],
                  internalColumn: [],
                  value: [],
                }
              );
              console.log("popoverData:", popoverData);
              popoverData.value.forEach(function (item, i) {
                findTargets(
                  table,
                  item,
                  popoverData.externalColumn[i],
                  popoverData.internalColumn[i]
                );
              });
            }
            return false;
          },
          error: function (error) {
            console.log("Error: Get list choices request Failed.");
          },
        });
      });
    };
  }

  var styler = function ({ color, width }) {
    return `width:${width}px;height:${width}px;border-radius:${
      width / 2
    }px;background-color:${color}`;
  };

  //Entry Point and General Function
  function findTargets($table, values, externalColumn, internalColumn, colors) {
    if (!$table || $table.childNodes.length === 0) {
      return;
    }

    //deafult keywords that have values.
    var defaults = [
      { color: "green", text: "up" },
      { color: "red", text: "down" },
      { color: "yellow", text: "degraded" },
      { color: "green", text: "100-90" },
      { color: "yellow", text: "89-80" },
      { color: "red", text: "79-10" },
      { color: "steelblue", text: "<10" },
    ];

    //Step 3. Iterate over each cell and compare the inner text to the list of known defaults.
    var $rows = [].slice.call($table.getElementsByTagName("tr"));
    var thead = [].slice.call($table.getElementsByTagName("th"));
    var displayValue = "";
    var displayColor = "";

    $rows.map(function ($row, ri) {
      displayValue = "";
      var $cells = [].slice.call($row.getElementsByTagName("td"));

      if ($cells.length > 0) {
        //this checks if the cell contains the text which is in user choices, select that cell to add the modal
        $cells.map(function ($cell, ci) {
          //new logic
          var text = $cell.innerText;
          var defaultText = defaults.map(function (a) {
            return a.text;
          });
          var pos = defaultText.indexOf(text.toLowerCase());

          //get the mouse Event over the cell
          // $(cell).hover(function () {
          //   var position = $(this).offset();
          // });
          console.log("pos:", pos, "\ncell:", $cell);

          if (pos > -1) {
            $cell.innerHTML = `<div data-toggle='tooltip' title="moreInformation" ><div style=${styler(
              { color: defaults[pos].color, width: 20 }
            )}></div></div>`;
          }

          //Get the position of the td and find the c
          //old logic of finding the cell and assinging values
          // var add = false;
          // if (thead[ci]) {
          //   [].slice.call(thead[ci].children).forEach(function (item, ti) {
          //     [].slice.call(item.children).forEach(function (item, tci) {
          //       if (item.innerText) {
          //         if (containsString(item.innerText, "status")) {
          //           add =
          //             !containsString(item.innerText, "value") &&
          //             !containsString(item.innerText, "type");
          //           if (containsString(externalColumn, item.innerText)) {
          //             //Pseudo function
          //             if (
          //               externalColumn.split(" ").length - 1 ===
          //               item.innerText.split(" ").length
          //             ) {
          //               displayValue = cell.innerText;
          //             }
          //           } else {
          //             add = false;
          //           }
          //         }
          //       }
          //     });
          //   });
          // }
          //
          // if (add && table.getAttribute("id") && row.getAttribute("iid")) {
          //   [].slice.call(cell.children).forEach(function (item, i) {
          //     [].slice.call(item.children).forEach(function (item, i) {
          //       if (!displayValue) {
          //         displayValue = item.getAttribute("key");
          //       } else if (displayValue.length < 1) {
          //         displayValue = item.getAttribute("key");
          //       }
          //     });
          //   });
          //   if (displayValue) {
          //     addPopover(
          //       cell,
          //       values,
          //       displayValue,
          //       row.getAttribute("iid").split(",")[1],
          //       thead[ci],
          //       table.getAttribute("id").substring(1, 37),
          //       externalColumn,
          //       internalColumn
          //     );
          //   }
          // }
        });
      }
    });
    $(`[data-toggle="tooltip"]`).popover({
      placement: "right",
      trigger: "hover",
    });
  }

  /*
    This creates the popover for each cell
  */
  function addPopover(
    target,
    defaults,
    displayValue,
    rowIndex,
    thead,
    table,
    externalColumn,
    internalColumn
  ) {
    //Create Popover Element
    var popover = document.createElement("div");
    popover.style.backgroundColor = "	#ffffff";
    popover.style.color = "#000000";
    popover.style.padding = ".5rem";
    popover.style.border = "1px solid";
    popover.style.borderRadius = ".25rem";
    popover.style.zIndex = "1";

    //Create Header Element
    var header = document.createElement("div");
    header.style.padding = ".25rem";
    header.style.borderRadius = ".25rem";
    header.style.textAlign = "center";
    header.style.cursor = "pointer";
    header.style.marginBottom = ".25rem";
    header.style.backgroundColor = "#BABBFD";
    header.innerText = displayValue;

    //Create Options Panel Element
    var options = document.createElement("div");
    options.style.padding = ".25rem";
    options.style.borderRadius = ".25rem";

    //Create and Add Option Elements
    defaults.forEach(function (ele, index) {
      var optionPanel = document.createElement("div");
      optionPanel.style.padding = ".25rem";
      optionPanel.style.marginBottom = ".25rem";
      optionPanel.style.textAlign = "left";
      optionPanel.style.borderRadius = ".25rem";

      var option = document.createElement("div");
      option.innerText = ele;
      option.style.marginLeft = ".25rem";
      option.style.display = "inline";
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.style.margin = "0px";
      radio.style.display = "inline";

      if (containsString(ele, displayValue)) {
        radio.checked = "checked";
        optionPanel.style.backgroundColor = "#BABBFD";
      } else {
        radio.style.cursor = "pointer";
        optionPanel.style.cursor = "pointer";
        optionPanel.addEventListener("click", function () {
          radio.checked = "checked";
          optionPanel.style.backgroundColor = "#BABBFD";
          updateTarget(
            ele,
            rowIndex,
            thead.innerText,
            table,
            externalColumn,
            internalColumn
          );
        });
        optionPanel.addEventListener("mouseenter", function () {
          optionPanel.style.boxShadow = "0px 0px 10px #BABBFD";
        });
        optionPanel.addEventListener("mouseleave", function () {
          optionPanel.style.boxShadow = "0px 0px 0px";
        });
      }

      //Add Click Event to update list
      optionPanel.appendChild(radio);
      optionPanel.appendChild(option);
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
    target.addEventListener("mouseenter", function () {
      document.body.appendChild(popover);

      popover.style.position = "fixed";
      popover.style.left = target.getBoundingClientRect().right + "px";
      popover.style.top = target.getBoundingClientRect().top + "px";
    });

    target.addEventListener("mouseleave", function (e) {
      if (popover.contains(e.relatedTarget)) return;
      if (popover) {
        if (popover.parentNode) {
          popover.parentNode.removeChild(popover);
        }
      }
    });

    //Add Mouse leave Event to hide
    popover.addEventListener("mouseleave", function () {
      options.style.display = "none";
      if (popover) {
        if (popover.parentNode) {
          popover.parentNode.removeChild(popover);
        }
      }
    });
  }

  function updateTarget(
    ele,
    rowIndex,
    header,
    table,
    externalColumn,
    internalColumn
  ) {
    var site = _spPageContextInfo.webServerRelativeUrl;
    var currentListName = ctx.ListTitle;
    var listName = "SP.ListItem";
    var data = {
      __metadata: { type: listName },
    };
    data[internalColumn] = ele;
    var url =
      site +
      "/_api/web/lists('" +
      table +
      "')/items(" +
      rowIndex +
      ")?$select=" +
      internalColumn;
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
        alert("Updated " + header + " Successfully");
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

  function parseFormulaColumn(formula) {
    var reg = /([()])/g;
    var parsedFormula = formula.split("IF")[1].split("=")[0].split(",");
    switch (parsedFormula.length) {
      case 1:
        return parsedFormula[0].replace(reg, "");
      case 2:
        return parsedFormula[1].replace(reg, "");
      default:
        throw new Error("Formula incorrect size");
    }
  }

  function parseFormula(formula) {
    return formula.split("IF").reduce(function (acc, cv, ci, init) {
      if (ci !== 0) {
        var splitEqual = cv.split("=");
        switch (splitEqual.length) {
          case 2:
            if (splitEqual[0].indexOf('"') > -1) {
              acc.push([
                splitEqual[0].split('"')[1],
                splitEqual[1].split(",")[1],
              ]);
            } else {
              acc.push([splitEqual[1].split(",")]);
            }
            break;
          case 3:
            if (splitEqual[0].indexOf('"') > -1) {
              acc.push([
                splitEqual[0].split('"')[1],
                (splitEqual[1] + "=" + splitEqual[2]).split(",")[1],
              ]);
            } else {
              var temp = splitEqual[1] + "=" + splitEqual[2];

              acc.push([temp.split(",")]);
            }
            break;
          case 4:
            if (splitEqual[0].indexOf('"') > -1) {
              acc.push([
                splitEqual[0].split('"')[1],
                (
                  splitEqual[1].split(",")[1] +
                  "=" +
                  splitEqual[2] +
                  "=" +
                  splitEqual[3]
                ).replace(",", ""),
              ]);
            } else {
              var temp = (
                splitEqual[1].split(",")[1] +
                "=" +
                splitEqual[2] +
                "=" +
                splitEqual[3]
              ).replace(",", "");
              acc.push([temp]);
            }
            break;
          default:
            break;
        }
      }
      return acc;
    }, []);
  }

  //True, error.  False, no error.
  function errorChecking(obj) {
    if (!obj) {
      console.error("Undefined");
      return true;
    }

    if (obj.length) {
      if (obj.length === 0) {
        console.error("Nothing in the array");
        return true;
      }
    }

    return false;
  }

  /*Checks to see if s0 is contains to s1*/
  function containsString(s0, s1) {
    return s0.toLowerCase().indexOf(s1.toLowerCase()) > -1;
  }

  /*Uses containsString to check to see if the two strings are equal*/
  function compareString(s0, s1) {
    return containsString(s0, s1) && containsString(s1, s0);
  }
})();
