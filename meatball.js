(function () {
  //Size sets the Meatball size in pixels
  var size = 20;
  var meatballHistoryItemContainerWidth = "calc(250px - 1.125rem)";
  //Creates the Color object which manages meatball colors
  var colors = new Colors();
  var backgroundColor = "#F0F0F0";
  //Creates the Pantry object which manages toast notifications
  var kitchen = new Pantry();

  var addShadow = "0px 0px 10px #BABBFD";
  var removeShadow = "0px 0px 0px";
  var regex = /[^\d\w\s\.\?\!\@]/g;
  //Used by developers in Production to find bugs
  var debug = false;

  var historyListGUID = "";

  //On initial load
  window.addEventListener("load", function () {
    start();
    function historyChatCb(props) {
      historyListGUID = props;
    }
    findHistoryChat(historyChatCb);
  });

  //On change
  window.addEventListener("hashchange", function () {
    start();
  });

  function start() {
    if (!window.jQuery) {
      alert("Please contact help desk.  Script not properly loaded.");
      return;
    }

    window.addEventListener("error", function (msg, url, line) {
      if (debug) {
        var errorToast = new Toast().setMessage(msg).setListeners().show();
        kitchen.debug(errorToast);
      }
    });

    //Checks for overrides
    if (window.meatball_override) {
      meatball_override.forEach(function (item) {
        colors.set(item.value, item.color);
      });
    }

    //Get all the tables -- create array
    var tables = [].slice.call(document.getElementsByTagName("table"));

    if (errorChecking(tables)) {
      if (debug) {
        var errorToast = new Toast()
          .setMessage("No Tables Found")
          .setListeners()
          .show();
        kitchen.debug(errorToast);
      }
      return;
    }
    //Include only the actual lists
    tables = tables.filter(function (table) {
      return table.getAttribute("class") === "ms-listviewtable";
    });
    //Grabbing the list url + Iterate through the set of tables
    tables.forEach(function (table, ti) {
      var currentListId = table.getAttribute("id").substring(1, 37);
      var root = ctx.HttpRoot;
      var url =
        root +
        "/_api/web/lists('" +
        currentListId +
        "')/fields?$filter=TypeDisplayName eq 'Choice'";
      var listTitle = table.summary;
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
            //Returns all columns with choices
            var popoverData = data.d.results.reduce(
              function (acc, cv, ci, data) {
                var add = true;
                if (cv.Choices) {
                  if (acc.value.indexOf(cv.Choices.results) < 0) {
                    acc.value.push(cv.Choices.results);
                    acc.internalColumn.push(cv.InternalName);
                    acc.externalColumn.push(cv.Title);
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
            popoverData.value.forEach(function (item, i) {
              findTargets(
                table,
                item,
                popoverData.externalColumn[i],
                popoverData.internalColumn[i],
                listTitle
              );
            });
          }
          return false;
        },
        error: function (error) {
          if (debug) {
            var errorToast = new Toast()
              .setMessage("Error: Get list choices request Failed.")
              .setListeners()
              .show();
            kitchen.debug(errorToast);
          }
        },
      });
    });
  }

  //Finds cells with known default values and replaces them with meatballs
  function findTargets(
    $table,
    values,
    externalColumn,
    internalColumn,
    listTitle
  ) {
    if (!$table || $table.childNodes.length === 0) {
      return;
    }
    //Iterate over each cell and compare the inner text to the list of known defaults.
    var $rows = [].slice.call($table.getElementsByTagName("tr"));
    var $thead = [].slice.call($table.getElementsByTagName("th"));
    var displayValue,
      text = "";
    var add = false;
    $rows.map(function ($row, ri) {
      displayValue = "";

      var $cells = [].slice.call($row.getElementsByTagName("td"));

      if ($cells.length > 0) {
        //this checks if the cell contains the text which is in user choices, selects that cell to add the meatball and popover
        $cells.map(function ($cell, ci) {
          //Comparing the thead (internal name) with the external name
          add = false;
          text = "";

          if ($thead[ci]) {
            [].slice.call($thead[ci].children).forEach(function (item, ti) {
              if (add) {
                return;
              }
              [].slice.call(item.children).forEach(function (item, tci) {
                if (add) {
                  return;
                }

                if (item.innerText) {
                  add = compareString(externalColumn, item.innerText);
                }
              });
            });
          }

          if (add && $table.getAttribute("id") && $row.getAttribute("iid")) {
            displayValue = $row.childNodes[1].innerText + ": " + externalColumn;

            if (displayValue) {
              text = $cell.innerText;
              new Meatball(size).init(
                values,
                externalColumn,
                internalColumn,
                $cell,
                $row.getAttribute("iid").split(",")[1],
                $thead[ci],
                $table.getAttribute("id").substring(1, 37),
                text,
                displayValue,
                listTitle
              );
            }
          }
        });
      }
    });
  }

  //Update target's value to user's selected value
  function updateTarget(
    ele,
    rowIndex,
    meatball,
    header,
    table,
    externalColumn,
    internalColumn,
    listTitle
  ) {
    var root = ctx.HttpRoot;
    var currentListName = ctx.ListTitle;
    var listName = "SP.ListItem";
    var data = {
      __metadata: { type: listName },
    };
    data[internalColumn] = ele;
    var url =
      root +
      "/_api/web/lists('" +
      table +
      "')/items(" +
      rowIndex +
      ")?$select=" +
      internalColumn;
    //Closes the popover
    meatball.removePopover();
    var toast = new Toast().startLoading().show();
    kitchen.show(toast);
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
        meatball.setColor(ele);
        toast
          .endLoading()
          .setMessage(
            listTitle + " - " + externalColumn + " updated successfully"
          )
          .setSuccess()
          .setListeners()
          .show();

        return false;
      },
      error: function (error) {
        toast
          .endLoading()
          .setMessage(listTitle + " - " + externalColumn + " failed to update")
          .setFailed()
          .setListeners()
          .show();
        kitchen.show(toast);
      },
    });
  }

  //Main object
  //Replaces default text from Color object with circles with color from Color object
  //Attaches popover to the color circle along with updateTarget function
  function Meatball(size) {
    this.size = size + "px";
    this.element = document.createElement("div");
    this.element.style.width = this.size;
    this.element.style.height = this.size;
    this.element.style.borderRadius = this.size;
    this.element.style.margin = "auto";
    this.element.style.padding = "0px";
  }

  Meatball.prototype.init = function (
    defaults,
    externalColumn,
    internalColumn,
    parent,
    rowIndex,
    thead,
    table,
    cellText,
    value,
    listTitle
  ) {
    var meatball = this;
    this.element.style.backgroundColor = colors.get(cellText);

    var triangleSize = 10;

    var meatballHistoryDisplay = new MeatballHistory(
      table,
      rowIndex,
      internalColumn,
      value
    );

    this.popoverPanel = document.createElement("div");
    this.popoverPanel.style.backgroundColor = "transparent";
    this.popoverPanel.style.padding = "10px";
    this.popoverBody = document.createElement("div");
    this.popoverBody.style.display = "inline-block";
    this.popoverBody.style.margin = "0px";
    this.popoverBody.style.padding = "0px";
    this.popoverBody.style.backgroundColor = backgroundColor;
    this.popoverBody.style.boxShadow = "1px 1px 4px 1px rgb(0 0 0 / 0.2)";

    var carret = document.createElement("div");
    carret.style.margin = "0px";
    carret.style.display = "inline-block";
    carret.style.position = "absolute";
    carret.style.height = "0px";
    carret.style.width = "0px";
    carret.style.left = "2px";
    carret.style.top = "29px";
    carret.style.borderTop = triangleSize + "px solid transparent";
    carret.style.borderBottom = triangleSize + "px solid transparent";
    carret.style.borderRight = triangleSize + "px solid " + backgroundColor;

    //Create Popover Element
    var popover = document.createElement("div");
    popover.style.display = "inline-block";
    popover.style.backgroundColor = backgroundColor;
    popover.style.color = "#000000";
    popover.style.padding = ".5rem";
    popover.style.boxShadow = "0px 0px 5px " + backgroundColor;
    popover.style.borderRadius = ".25rem";
    popover.style.zIndex = "1";

    //Create Header Element
    var header = document.createElement("div");
    header.style.padding = ".25rem";
    header.style.borderRadius = ".25rem";
    header.style.textAlign = "center";
    header.style.marginBottom = ".25rem";
    header.style.backgroundColor = "#BABBFD";
    header.innerText = value;
    //Create Options Panel Object
    var options = new OptionPanel();
    options.create(
      defaults,
      rowIndex,
      meatball,
      thead.innerText,
      table,
      externalColumn,
      internalColumn,
      cellText,
      listTitle,
      meatballHistoryDisplay
    );

    //Add Header Element
    popover.appendChild(header);
    //Add Options Panel
    popover.appendChild(options.options);

    //Add Click Event to display Options Panel
    header.addEventListener("click", function () {
      var style = options.style.display;
      var change = false;
      change = style === "block";
      change
        ? (options.style.display = "none")
        : (options.style.display = "block");
    });

    this.popoverBody.appendChild(carret);
    this.popoverBody.appendChild(popover);

    this.history = document.createElement("button");
    this.history.innerText = "History";
    this.history.style.borderRadius = ".25rem";
    this.history.style.padding = ".25rem";
    this.history.style.marginBottom = ".25rem";
    this.history.style.textAlign = "center";
    this.history.style.display = "block";
    this.history.style.cursor = "pointer";

    var add = true;

    function success(props, name) {
      props.currentUser = name;
    }
    getUserName(success, meatballHistoryDisplay);

    this.history.addEventListener("click", function () {
      if (add) {
        add = !add;
        function cb(error, data) {
          if (error) {
            console.log(error);
            return;
          }
          //make a conditional for if there are no resuklts then show a message
          if (data.length !== 0) {
            meatballHistoryDisplay.listGUID = historyListGUID;
            meatballHistoryDisplay.query = data[0].Title;
            data.forEach(function (props) {
              // historyPanel.clear(); --this deleted every entry and left the last one in the view
              meatballHistoryDisplay.build(
                new MeatballHistoryItem(
                  meatballHistoryDisplay.table
                ).setDisplay(
                  props.UserName,
                  generateDateTime(props.Created),
                  props.Message,
                  props.ID,
                  meatballHistoryDisplay.listGUID
                )
              );
            });
          } else {
            //set display to say no messages
          }
        }
        retrieveHistory(table, rowIndex, internalColumn, cb, true);
      }
      document.body.appendChild(meatballHistoryDisplay.mainPanel);
      meatballHistoryDisplay.container.scrollTop =
        meatballHistoryDisplay.container.scrollHeight;
    });
    this.popoverBody.appendChild(this.history);

    this.popoverPanel.appendChild(this.popoverBody);

    var popoverPanel = this.popoverPanel;
    var popoverBody = this.popoverBody;
    //Used addEventListener versus onmouseenter = function due to concerns of
    //overriding other scripts
    //Add Mouse Enter Event to display
    this.element.addEventListener("mouseenter", function () {
      if (!popoverPanel.parentNode) {
        document.body.appendChild(popoverPanel);

        popoverPanel.style.position = "fixed";
        popoverPanel.style.right = "0px";
        popoverPanel.style.left =
          this.getBoundingClientRect().right - 12 + triangleSize + "px";

        carret.style.position = "absolute";
        carret.style.top = "29px";
        carret.style.left = "2px";
        carret.style.right = "0px";
        carret.style.borderLeft = "0px";
        carret.style.borderRight = triangleSize + "px solid " + backgroundColor;

        carret.parentNode.removeChild(carret);

        var windowHeight = window.innerHeight || document.body.clientHeight;
        var windowWidth = window.innerWidth || document.body.clientWidth;

        if (
          popoverPanel.offsetHeight + this.getBoundingClientRect().top <
          windowHeight
        ) {
          popoverPanel.style.top =
            this.getBoundingClientRect().top - 40 + triangleSize + "px";
        } else {
          var meatballHeight =
            this.getBoundingClientRect().top - 40 + triangleSize;
          var meatballDifferenceHeight = Math.abs(
            meatballHeight - (windowHeight - popoverPanel.offsetHeight)
          );

          if (meatballHeight <= windowHeight - popoverPanel.offsetHeight) {
            carret.style.top = meatballDifferenceHeight + "px";
            popoverPanel.style.top =
              windowHeight -
              popoverPanel.offsetHeight -
              meatballDifferenceHeight +
              "px";
          } else {
            carret.style.top = 29 + meatballDifferenceHeight + "px";
            popoverPanel.style.top =
              windowHeight - popoverPanel.offsetHeight + "px";
          }
        }

        if (
          popoverBody.getBoundingClientRect().width +
            this.getBoundingClientRect().right >
          windowWidth
        ) {
          popoverPanel.appendChild(carret);
          carret.style.left =
            popoverBody.getBoundingClientRect().width + triangleSize + "px";
          carret.style.borderRight = "0px";
          carret.style.borderLeft =
            triangleSize + "px solid " + backgroundColor;
          popoverPanel.style.left =
            this.getBoundingClientRect().left -
            popoverBody.getBoundingClientRect().width -
            triangleSize -
            12 +
            "px";
          popoverPanel.style.width =
            popoverBody.getBoundingClientRect().width + triangleSize + "px";
        } else {
          popoverPanel.insertBefore(carret, popoverPanel.firstChild);
        }
      }
    });

    this.element.addEventListener("mouseleave", function (e) {
      if (!e.toElement.parentNode.contains(popoverPanel)) {
        popoverPanel.parentNode.removeChild(popoverPanel);
      }
    });

    //Add Mouse leave Event to hide
    this.popoverPanel.addEventListener("mouseleave", function (e) {
      // if (historyPanel) {
      //   if (historyPanel.historyPanel) {
      //     popoverPanel.removeChild(historyPanel.historyPanel);
      //   }
      // }
      if (popoverPanel) {
        if (popoverPanel.parentNode) {
          popoverPanel.parentNode.removeChild(popoverPanel);
        }
      }
    });
    parent.innerText = "";
    parent.appendChild(this.element);
  };

  Meatball.prototype.setColor = function (value) {
    this.element.style.backgroundColor = colors.get(value);
  };

  Meatball.prototype.removePopover = function () {
    if (this.popoverPanel) {
      if (this.popoverPanel.parentNode) {
        this.popoverPanel.parentNode.removeChild(this.popoverPanel);
      }
    }
  };

  //Shows list of predetermine choices for the user
  function OptionPanel() {
    this.options = document.createElement("div");
    this.options.style.padding = ".25rem";
    this.options.style.borderRadius = ".25rem";
  }

  OptionPanel.prototype.create = function (
    defaults,
    rowIndex,
    meatball,
    thead,
    table,
    externalColumn,
    internalColumn,
    cellText,
    listTitle,
    meatObj
  ) {
    var panel = this;

    defaults.forEach(function (ele, index) {
      var option = document.createElement("div");
      option.style.padding = ".25rem";
      option.style.marginBottom = ".25rem";
      option.style.textAlign = "left";
      option.style.borderRadius = ".25rem";
      option.style.cursor = "pointer";

      var description = document.createElement("div");
      description.innerText = ele;
      description.style.marginLeft = ".25rem";
      description.style.display = "inline";

      var radio = document.createElement("input");
      radio.name = "option";
      radio.style.margin = "0px";
      radio.style.display = "inline";
      radio.style.cursor = "pointer";
      radio.type = "radio";

      if (containsSubString(ele, cellText)) {
        radio.checked = true;
        option.style.backgroundColor = "#BABBFD";
      }

      option.addEventListener("mouseenter", function () {
        option.style.boxShadow = addShadow;
      });
      option.addEventListener("mouseleave", function () {
        option.style.boxShadow = removeShadow;
      });

      panel.options.addEventListener("mousedown", function () {
        [].slice.call(panel.options.children).forEach(function (item) {
          if (item.parentElement.querySelector(":hover") === item) {
            item.style.backgroundColor = "#BABBFD";
          } else {
            item.style.backgroundColor = "";
          }
        });
      });

      option.addEventListener("mouseup", function () {
        if (!radio.checked) {
          radio.checked = true;
          option.style.backgroundColor = "#BABBFD";
          option.style.boxShadow = "0px 0px 0px";
          updateTarget(
            ele,
            rowIndex,
            meatball,
            thead,
            table,
            externalColumn,
            internalColumn,
            listTitle
          );
          var autoComment =
            "Status change: " +
            cellText +
            " to " +
            ele +
            " by " +
            meatObj.currentUser;

          meatObj.build(
            new MeatballHistoryItem().setDisplay(
              "AutoBot",
              generateDateTime(),
              autoComment,
              null,
              historyListGUID,
              table,
              rowIndex,
              internalColumn
            )
          );
          makeHistory(
            historyListGUID,
            autoComment,
            internalColumn,
            rowIndex,
            table,
            "AutoBot",
            null,
            true
          );
        } else {
          option.style.backgroundColor = "#BABBFD";
        }
      });

      //Add Click Event to update list
      option.appendChild(radio);
      option.appendChild(description);
      panel.options.appendChild(option);
    });
  };

  function MeatballHistory(table, rowIndex, internalColumn, title) {
    var meatballHistory = this;
    var windowWidth = window.innerWidth || document.body.clientWidth;
    var windowHeight = window.innerHeight || document.body.clientHeight;

    this.mainPanel = document.createElement("div");
    this.mainPanel.style.width = windowWidth - 1 + "px";
    this.mainPanel.style.height = windowHeight - 1 + "px";
    this.mainPanel.style.backgroundColor = "rgb(0, 0, 0)";
    this.mainPanel.style.backgroundColor = "rgb(0, 0, 0, 0.4)";
    this.mainPanel.style.position = "absolute";
    this.mainPanel.style.left = "0px";
    this.mainPanel.style.top = "0px";

    this.mainPanel.addEventListener("click", function (e) {
      if (e.target == meatballHistory.mainPanel) {
        meatballHistory.mainPanel.parentNode.removeChild(
          meatballHistory.mainPanel
        );
      }
    });

    window.addEventListener("resize", function () {
      var windowWidth = window.innerWidth || document.body.clientWidth;
      var windowHeight = window.innerHeight || document.body.clientHeight;
      meatballHistory.mainPanel.style.width = windowWidth;
      meatballHistory.mainPanel.style.height = windowHeight;
    });

    this.listGUID = historyListGUID;
    this.currentUser = "";

    this.historyPanel = document.createElement("div");
    this.historyPanel.style.padding = ".25rem";
    this.historyPanel.style.width = "calc(500px - .5rem)";
    this.historyPanel.style.height = windowHeight + "px";
    this.historyPanel.style.backgroundColor = "#202020";
    this.historyPanel.style.textAlign = "left";
    this.historyPanel.style.position = "fixed";
    this.historyPanel.style.top = "0px";
    this.historyPanel.style.right = "0px";

    this.title = document.createElement("div");
    this.title.style.width = "calc(500px - .5rem)";
    this.title.style.textAlign = "center";
    this.title.style.marginRight = "auto";
    this.title.style.marginLeft = "auto";
    this.title.style.marginBottom = ".5rem";
    this.title.style.display = "flex";
    this.title.style.flexDirection = "row";

    this.titleDescription = document.createElement("div");
    this.titleDescription.innerText = title + " - History";
    this.titleDescription.style.flexGrow = "1";
    this.titleDescription.style.flexShrink = "1";
    this.titleDescription.style.paddingLeft = ".5rem";
    this.titleDescription.style.textAlign = "left";
    this.titleDescription.style.color = "#dfdfdf";

    this.title.appendChild(this.titleDescription);

    this.svgContainer = document.createElement("div");
    this.svgContainer.style.flexGrow = "4";
    this.svgContainer.style.flexShrink = "1";
    this.svgContainer.style.textAlign = "right";
    this.svgContainer.style.marginRight = ".75rem";

    this.x = document.createElement("div");
    this.x.innerText = "X";
    this.x.title = "Close";
    this.x.style.textSize = "16pt";
    this.x.style.padding = ".25rem";
    this.x.style.cursor = "pointer";
    this.x.style.width = "15px";

    this.x.addEventListener("mouseenter", function () {
      this.style.color = "#202020";
      this.style.textShadow = "1px 1px 1px #dfdfdf";
    });

    this.x.addEventListener("mouseleave", function () {
      this.style.color = "#dfdfdf";
      this.style.textShadow = "0px 0px 0px #000";
    });

    this.x.addEventListener("click", function () {
      this.style.color = "#dfdfdf";
      this.style.textShadow = "0px 0px 0px #000";
      meatballHistory.mainPanel.parentNode.removeChild(
        meatballHistory.mainPanel
      );
    });

    this.title.appendChild(this.svgContainer);
    this.title.appendChild(this.x);

    this.historyPanel.appendChild(this.title);

    this.addMore = document.createElement("div");
    this.addMore.innerText = "Show More";
    this.addMore.style.cursor = "pointer";
    this.addMore.style.marginTop = ".25rem";
    this.addMore.style.marginLeft = "auto";
    this.addMore.style.marginRight = "auto";
    this.addMore.style.padding = ".25rem";
    this.addMore.style.borderRadius = ".25rem";
    this.addMore.style.width = "115px";
    this.addMore.style.backgroundColor = "#999999";
    this.addMore.style.textAlign = "center";

    this.historyPanel.appendChild(this.addMore);

    this.container = document.createElement("div");
    this.container.style.width = "calc(500px - 2.25rem)";
    this.container.style.height = windowHeight - 150 + "px";
    this.container.style.margin = "auto";
    this.container.style.paddingTop = ".25rem";
    this.container.style.paddingLeft = ".25rem";
    this.container.style.paddingRight = "2rem";
    this.container.style.overflowX = "hidden";
    this.container.style.overflowY = "auto";
    this.container.addNew = true;
    this.container.isEdit = true;

    this.historyPanel.appendChild(this.container);

    this.addPanel = document.createElement("div");
    this.addPanel.style.width = "calc(500px - 2.25rem)";
    this.addPanel.style.padding = ".25rem";
    this.addPanel.style.marginTop = ".25rem";
    this.addPanel.style.marginLeft = "auto";
    this.addPanel.style.marginRight = "auto";

    this.svg = new SVGGenerator({
      color: "green",
      type: "add",
      size: "normal",
    }).wrapper;
    this.svg.style.cursor = "pointer";
    this.svg.style.padding = ".25rem";
    this.svg.style.verticalAlign = "middle";

    this.svg.addEventListener("click", function () {
      if (meatballHistory.container) {
        if (meatballHistory.container.addNew) {
          meatballHistory.container.scroll(0, 0);
          meatballHistory.container.addNew = false;
          meatballHistory.newItem(
            meatballHistory,
            table,
            rowIndex,
            internalColumn
          );
        }
      }
    });

    this.newComment = document.createElement("textarea");
    this.newComment.contentEditable = true;
    this.newComment.placeholder = "Enter Comment Here";
    this.newComment.value = "";

    this.newComment.title = "Enter Comment Here";
    this.newComment.style.resize = "none";
    this.newComment.style.row = "1";
    this.newComment.style.height = "14pt";
    this.newComment.style.width = "calc(475px - 3rem)";
    this.newComment.style.display = "inline-block";
    this.newComment.style.padding = ".25rem";
    this.newComment.style.backgroundColor = "#333333";
    this.newComment.style.color = "#dddddd";
    this.newComment.style.borderRadius = ".25rem";
    this.newComment.style.verticalAlign = "middle";

    this.addPanel.appendChild(this.newComment);
    this.addPanel.appendChild(this.svg);

    this.historyPanel.appendChild(this.addPanel);
    var add = true;

    this.addMore.addEventListener("click", function () {
      //possilble history.clear is needed  - pierre
      //it needs the information for the cell, table, row etc
      if (add) {
        add = !add;
        function cb(error, data) {
          if (error) {
            console.log(error);
            return;
          }
          var priorDate,
            currentDate = null;
          var nowDate = new Date();
          data.forEach(function (props, index) {
            if (index !== 0) {
              currentDate = new Date(props.Created);

              var mhItem = new MeatballHistoryItem(
                meatballHistory.table
              ).setDisplay(
                props.UserName,
                generateDateTime(props.Created),
                props.Message,
                props.ID,
                historyListGUID,
                table,
                rowIndex,
                internalColumn
              );

              meatballHistory.build(mhItem);

              if (!priorDate) {
                priorDate = currentDate;
              }
              if (currentDate.getDate() != nowDate.getDate()) {
                if (priorDate.getDate() != currentDate.getDate()) {
                  meatballHistory.addDividor(priorDate, mhItem.item);
                }

                if (index + 1 === data.length) {
                  meatballHistory.addDividor(priorDate, mhItem.item);
                }
              }

              priorDate = currentDate;
            }
          });
        }
        retrieveHistory(table, rowIndex, internalColumn, cb, false, null);
      }
      meatballHistory.addMore.remove();
      meatballHistory.container.scrollTop =
        meatballHistory.container.scrollHeight;
    });

    this.mainPanel.appendChild(this.historyPanel);
    return this;
  }

  MeatballHistory.prototype.newItem = function (
    meatballObj,
    table,
    rowIndex,
    internalColumn
  ) {
    if (this.currentUser.length === 0) {
      function success(props, name) {
        var item = new MeatballHistoryItem(
          historyListGUID,
          table,
          rowIndex,
          internalColumn
        ).setDisplay(
          name,
          generateDateTime(),
          autoComment,
          table,
          rowIndex,
          internalColumn
        );
        props.currentUser = name;
        item.isNew = true;
        item.setType(name);
        props.container.appendChild(item.item);
        props.container.scrollTop = this.container.scrollHeight;
      }
      getUserName(success, this);
    } else {
      var item = new MeatballHistoryItem(
        historyListGUID,
        table,
        rowIndex,
        internalColumn
      ).setDisplay(this.currentUser, generateDateTime(), this.newComment.value);
      item.isNew = true;
      item.setType(this.currentUser);
      this.container.appendChild(item.item);
      this.container.scrollTop = this.container.scrollHeight;
    }
    function listEntrySuccess(data) {
      item.setEditable(item.getEditable(), historyListGUID, data.ID, false);
    }
    makeHistory(
      historyListGUID,
      this.newComment.value,
      internalColumn,
      rowIndex,
      table,
      this.currentUser,
      listEntrySuccess
    );
    this.newComment.value = "";
    return this;
  };

  MeatballHistory.prototype.build = function (props) {
    if (this.currentUser) {
      props.setType(this.currentUser);
    } else if (props.name) {
      props.setType(props.name);
    } else {
      props.setType(null);
    }
    this.container.insertBefore(props.item, this.container.firstChild);
    this.container.scrollTop = this.container.scrollHeight;
    return this;
  };

  MeatballHistory.prototype.addDividor = function (date, child) {
    var dividorPanel = document.createElement("div");
    dividorPanel.style.padding = ".25rem";
    dividorPanel.style.width = "calc(500px - 2.5rem)";
    dividorPanel.style.margin = "0px";
    dividorPanel.style.marginBottom = ".25rem";
    dividorPanel.style.padding = ".25rem";
    dividorPanel.style.padding = "#191919";
    dividorPanel.style.color = "#e7e7e7";
    dividorPanel.style.float = "center";
    dividorPanel.style.clear = "both";

    var text = document.createElement("div");
    text.innerText = date.toDateString();
    text.style.textAlign = "center";

    dividorPanel.appendChild(document.createElement("hr"));
    dividorPanel.appendChild(text);
    dividorPanel.appendChild(document.createElement("hr"));
    this.container.insertBefore(dividorPanel, child);
    return this;
  };

  MeatballHistory.prototype.clear = function () {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  };

  function MeatballHistoryItem(
    historyListGUID,
    table,
    rowindex,
    internalColumn
  ) {
    var meatballHistoryItem = this;
    this.item = document.createElement("div");
    this.item.type = "auto";
    this.item.style.padding = ".25rem";
    this.item.style.width = meatballHistoryItemContainerWidth;
    this.item.style.margin = "0px;";
    this.item.style.marginBottom = ".25rem";
    this.item.style.padding = ".25rem";
    this.item.style.backgroundColor = "#191919";
    this.item.style.borderRadius = ".5rem";

    this.display = document.createElement("div");
    this.display.style.display = "block";
    this.display.style.width = meatballHistoryItemContainerWidth;
    this.display.style.padding = "0px";
    this.display.style.marginRight = "0px";
    this.display.style.marginLeft = "0px";

    this.date = document.createElement("div");
    this.date.contentEditable = false;
    this.date.style.width = meatballHistoryItemContainerWidth;
    this.date.style.padding = ".25rem";
    this.date.style.margin = "0px";
    this.date.style.verticalAlign = "middle";
    this.date.style.textAlign = "left";
    this.date.style.fontSize = "8pt";
    this.date.style.display = "inline-block";
    this.display.appendChild(this.date);

    this.isNew = false;

    this.submit = document.createElement("div");
    this.submit.innerText = "Submit";
    this.submit.style.backgroundColor = "#aaaaaa";
    this.submit.style.width = "75px";
    this.submit.style.cursor = "pointer";
    this.submit.style.margin = "auto";
    this.submit.style.marginRight = ".25rem";
    this.submit.style.padding = ".25rem";
    this.submit.style.borderRadius = ".25rem";
    this.submit.addEventListener("click", function () {
      function success(props, name) {
        function newHistoryChatCb(newListGUID) {
          if (meatballHistoryItem.isNew) {
            function listEntrySuccess(data) {
              meatballHistoryItem.setEditable(
                !meatballHistoryItem.getEditable(),
                newListGUID,
                data.ID,
                true
              );
            }
            //this will need a cb in order to get the value of list
            makeHistory(
              newListGUID,
              "placeholder",
              internalColumn,
              rowindex,
              table,
              name,
              listEntrySuccess
            );
          } else {
            meatballHistoryItem.setEditable(!meatballHistoryItem.getEditable());
          }
        }
        findHistoryChat(newHistoryChatCb, true);
      }
      getUserName(success, this);
    });

    this.buttonGroup = document.createElement("div");
    this.buttonGroup.style.width = meatballHistoryItemContainerWidth;
    this.buttonGroup.style.textAlign = "right";
    this.buttonGroup.style.margin = "0px";
    this.buttonGroup.style.padding = "0px";
    this.buttonGroup.style.display = "flex";
    this.buttonGroup.style.alignContent = "flex-start";
    this.buttonGroup.style.justifyContent = "space-around";

    this.author = document.createElement("div");
    this.author.contentEditable = false;
    this.author.style.width = "calc(500px - 2.75rem)";
    this.author.style.padding = ".25rem";
    this.author.style.margin = "0px";
    this.author.style.verticalAlign = "middle";
    this.author.style.textAlign = "left";
    this.author.style.fontSize = "8pt";
    this.buttonGroup.appendChild(this.author);

    this.edit = new SVGGenerator({
      color: "green",
      type: "edit",
      size: "small",
    }).wrapper;
    this.edit.style.cursor = "pointer";
    this.edit.style.flexGrow = "4";
    this.edit.style.flexShrink = "1";
    this.edit.addEventListener("click", function () {
      meatballHistoryItem.isNew = false;

      if (meatballHistoryItem.item.parentNode.isEdit) {
        meatballHistoryItem.item.parentNode.isEdit = false;
        meatballHistoryItem.setEditable(!meatballHistoryItem.getEditable());
      }
    });
    this.buttonGroup.appendChild(this.edit);

    this.delete = new SVGGenerator({
      color: "black",
      type: "delete",
      size: "small",
    }).wrapper;
    this.delete.style.cursor = "pointer";
    this.delete.style.marginLeft = "15px";
    this.delete.style.textAlign = "left";
    this.delete.style.flexGrow = "1";
    this.delete.style.flexShrink = "1";
    this.delete.addEventListener("click", function () {
      if (meatballHistoryItem.item) {
        if (meatballHistoryItem.item.parentNode) {
          if (!meatballHistoryItem.item.parentNode.addNew) {
            meatballHistoryItem.item.parentNode.addNew = true;
          }
          if (!meatballHistoryItem.item.parentNode.isEdit) {
            meatballHistoryItem.item.parentNode.isEdit = true;
          }
          meatballHistoryItem.item.parentNode.removeChild(
            meatballHistoryItem.item
          );
          function newHistoryChatCb(listGUID) {
            deleteHistory(listGUID, meatballHistoryItem.id);
          }
          findHistoryChat(newHistoryChatCb, true);
        }
      }
    });
    this.buttonGroup.appendChild(this.delete);

    this.item.appendChild(this.buttonGroup);

    this.comment = document.createElement("div");
    this.comment.contentEditable = false;
    this.comment.style.padding = ".25rem";
    this.comment.style.margin = "0px";
    this.comment.style.display = "inline-block";
    this.comment.style.verticalAlign = "middle";
    this.comment.style.fontSize = "12pt";

    this.item.appendChild(this.comment);
    this.item.appendChild(this.display);

    return this;
  }

  MeatballHistoryItem.prototype.setDisplay = function (
    author,
    date,
    comment,
    id,
    listGUID,
    table,
    rowIndex,
    internalColumn
  ) {
    this.author.innerText = author;
    this.comment.innerText = comment.replace(regex, "", comment);
    this.date.innerText = date;
    this.id = id;
    this.listGUID = listGUID;
    this.table = table;
    this.rowIndex = rowIndex;
    this.internalColumn = internalColumn;
    return this;
  };

  MeatballHistoryItem.prototype.setEditable = function (
    value,
    listGUID,
    id,
    newEntry
  ) {
    if (value) {
      this.comment.style.border = "1px solid black";
      this.display.appendChild(this.submit);
    } else {
      var currentText = this.comment.innerText;
      currentText = currentText.replace(regex, "", currentText);
      this.comment.innerText = currentText;
      if (currentText.trim().length === 0) {
        return;
      }
      this.comment.style.border = "0px";
      this.display.removeChild(this.submit);

      if (!this.item.parentNode.addNew && this.isNew) {
        this.item.parentNode.addNew = true;
        this.isNew = false;
      }
      if (!this.item.parentNode.isEdit) {
        this.item.parentNode.isEdit = true;
      }
      if (newEntry) {
        updateHistory(listGUID, id, currentText);
      } else {
        updateHistory(this.listGUID, this.id, currentText);
      }
    }
    this.comment.contentEditable = value;
    return this;
  };

  MeatballHistoryItem.prototype.getEditable = function () {
    return this.comment.contentEditable === "true";
  };

  MeatballHistoryItem.prototype.setType = function (author) {
    if (this.author.innerText.indexOf(author) > -1) {
      this.item.type = "editable";
      this.item.style.backgroundColor = "#DFDFDF";
      this.item.style.color = "#313131";
      this.item.style.float = "right";
    } else {
      this.item.type = "disabled";
      this.item.style.backgroundColor = "#191919";
      this.item.style.color = "#f7f7f7";
      this.item.style.float = "left";
    }
    if (this.item.type !== "editable") {
      this.delete.parentNode.removeChild(this.delete);
      this.edit.parentNode.removeChild(this.edit);
    }
  };

  MeatballHistoryItem.prototype.getType = function () {
    return this.item.type;
  };

  //A hashmap between values and colors
  function Colors() {
    this.blue = "#0075ff";
    this.green = "#27e833";
    this.red = "#d71010";
    this.yellow = "#f6de1c";
    this.defaults = [
      { value: "Up", color: this.green },
      { value: "Down", color: this.red },
      { value: "Degraded", color: this.yellow },
      { value: "NA", color: "inherit" },
      { value: "100-90", color: this.green },
      { value: "89-79", color: this.yellow },
      { value: "79-10", color: this.red },
      { value: "<79", color: this.red },
      { value: "<10", color: this.blue },
    ];
  }

  //Gets colors.  If it cannot find a color, it defaults to black
  Colors.prototype.get = function (value) {
    if (!value) {
      return "#000000";
    }
    var results = this.defaults.filter(function (item) {
      if (containsSubString(item.value, value)) {
        return item;
      }
    });

    if (results[0]) {
      return results[0].color;
    } else {
      return "#000000";
    }
  };

  //Either replaces the default value or creates a new values
  //If a known color value is called, it will use one of the default colors
  //For example, if user supplies blue, then #0075ff is added
  Colors.prototype.set = function (value, color) {
    if (this.replaceValue(value, color)) {
      return;
    }
    if (compareString(color, "blue")) {
      this.defaults.push({ value: value, color: this.blue });
    } else if (compareString(color, "green")) {
      this.defaults.push({ value: value, color: this.green });
    } else if (compareString(color, "red")) {
      this.defaults.push({ value: value, color: this.red });
    } else if (compareString(color, "yellow")) {
      this.defaults.push({ value: value, color: this.yellow });
    } else {
      this.defaults.push({ value: value, color: color });
    }
  };

  //Private function for the Color object
  Colors.prototype.replaceValue = function (value, color) {
    var found = false;
    this.defaults.map(function (item, index) {
      if (compareString(value, item.value)) {
        found = true;
        item = { value: value, color: color };
      }
    });
    return found;
  };

  //Controller for the Toast Object
  function Pantry() {
    this.container = document.createElement("div");
    this.container.style.width = "250px";
    this.container.style.right = "40px";
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";
    this.container.style.zIndex = "1";
    this.container.style.top = "75px";
    this.container.style.position = "fixed";
    this.container.style.backgroundColor = "transparent";
    document.body.appendChild(this.container);
  }

  Pantry.prototype.show = function (notification) {
    var note = notification;
    this.container.appendChild(notification.toast);
    var timer = setTimeout(
      function (note) {
        note.removeToast();
      },
      3000,
      note
    );
    return this;
  };

  Pantry.prototype.debug = function (toast) {
    this.container.appendChild(toast.toast);
  };

  //Notification object with ability to display messages, and images
  function Toast() {
    this.toast = document.createElement("div");
    this.toast.id = generateId();
    this.toast.style.backgroundColor = "white";
    this.toast.style.borderRadius = "0";
    this.toast.style.boxShadow = "0px 1px 1px rgba(0,0,0,0.1)";
    this.toast.style.color = "black";
    this.toast.style.display = "flex";
    this.toast.style.marginTop = "5px";
    this.toast.style["-ms-flex"] = "1 0 1";
    this.toast.style.height = "50px";
    this.toast.style.padding = "0.5rem";
    this.toast.style.width = "275px";
    this.toast.style.zIndex = "1";
    this.text = document.createElement("div");
    this.text.style.display = "flex";
    this.text.style.flexDirection = "column";
    this.text.style.justifyContent = "center";
    this.text.style.position = "relative";
    this.text.style.paddingLeft = "10px";
    return this;
  }

  Toast.prototype.setMessage = function (message) {
    this.message = message;
    this.title = document.createElement("div");
    this.title.style.fontSize = "12pt";
    this.subtitle = document.createElement("div");
    this.subtitle.innerText = this.message;
    this.subtitle.style.fontSize = "9pt";
    this.close = document.createElement("div");
    this.close.innerText = "x";
    this.close.style.cursor = "pointer";
    this.close.style.display = "flex";
    this.close.style.flexDirection = "column";
    this.close.style.fontSize = "14px";
    this.close.style.height = "14px";
    this.close.style.justifyContent = "center";
    this.close.style.position = "absolute";
    this.close.style.right = "0px";
    this.close.style.top = "0px";
    this.close.style.width = "14px";
    this.text.appendChild(this.title);
    this.text.appendChild(this.subtitle);
    this.text.appendChild(this.close);
    return this;
  };

  Toast.prototype.setListeners = function () {
    var self = this.toast;
    this.close.addEventListener("click", function () {
      self.removeToast();
    });
    return this;
  };

  Toast.prototype.startLoading = function () {
    var icon = new SVGGenerator({
      color: "",
      type: "loading",
    }).setLoadAnimation();
    this.svg = icon.wrapper;
    return this;
  };

  Toast.prototype.endLoading = function () {
    this.svg.parentNode.removeChild(this.svg);
    return this;
  };

  Toast.prototype.setSuccess = function () {
    var icon = new SVGGenerator({ color: "green", type: "success" });
    this.svg = icon.wrapper;
    this.title.innerText = "Successfully Saved";
    return this;
  };

  Toast.prototype.setFailed = function () {
    var icon = new SVGGenerator({ color: "red", type: "failure" });
    this.svg = icon.wrapper;
    this.title.innerText = "Failed to Save";
    return this;
  };

  Toast.prototype.show = function () {
    this.toast.appendChild(this.svg);
    this.toast.appendChild(this.text);
    return this;
  };

  Toast.prototype.removeToast = function () {
    if (this.toast) {
      if (this.toast.parentNode) {
        this.toast.parentNode.removeChild(this.toast);
        clearTimeout(this.timer);
      }
    }
    return this;
  };

  function SVGGenerator(props) {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.wrapper = document.createElement("div");
    this.wrapper.style.display = "inline-block";

    this.svg.setAttribute("role", "img");
    this.svg.setAttribute("viewBox", "0 0 512 512");
    this.svg.setAttribute("alignment-baseline", "baseline");
    this.g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    switch (props.size) {
      case "small":
        this.svg.setAttribute("width", ".5em");
        this.svg.setAttribute("height", ".5em");
        this.wrapper.style.width = ".5em";
        this.wrapper.style.height = ".5em";
        break;
      case "normal":
        this.svg.setAttribute("width", "1em");
        this.svg.setAttribute("height", "1em");
        this.wrapper.style.width = "1em";
        this.wrapper.style.height = "1em";
        break;
      case "large":
        this.svg.setAttribute("width", "2em");
        this.svg.setAttribute("height", "2em");
        this.wrapper.style.width = "2em";
        this.wrapper.style.height = "2em";
        break;
      default:
        this.svg.setAttribute("width", "1em");
        this.svg.setAttribute("height", "1em");
        this.wrapper.style.width = "1em";
        this.wrapper.style.height = "1em";
        break;
    }

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    if (props.type !== "loading") {
      path.setAttribute("fill", props.color);
    }
    var iconPath;
    switch (props.type) {
      case "add":
        iconPath =
          "M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z";
        this.wrapper.title = "Add";
        break;

      case "close":
        var text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.innerText = "X";
        this.wrapper.title = "Close";
        this.svg.appendChild(text);
        break;

      case "delete":
        iconPath =
          "M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z";
        this.wrapper.title = "Delete";
        break;

      case "edit":
        iconPath =
          "M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z";
        this.wrapper.title = "Edit";
        break;

      case "failure":
        iconPath =
          "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z";
        this.wrapper.title = "Failure";
        break;

      case "loading":
        iconPath =
          "M 63.85,0 A 63.85,63.85 0 1 1 0,63.85 63.85,63.85 0 0 1 63.85,0 Z m 0.65,19.5 a 44,44 0 1 1 -44,44 44,44 0 0 1 44,-44 z";
        this.wrapper.title = "Loading";
        break;

      case "success":
        iconPath =
          "M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z";
        this.wrapper.title = "Success";
        break;

      default:
        iconPath = "";
        break;
    }
    path.setAttribute("d", iconPath);
    this.g.appendChild(path);
    this.svg.appendChild(this.g);
    this.wrapper.appendChild(this.svg);
  }

  SVGGenerator.prototype.setLoadAnimation = function () {
    var linearGradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );
    linearGradient.setAttribute("id", "colorFill");
    var stops = [
      {
        color: "#ffffff",
        offset: "0%",
        opacity: "0",
      },
      {
        color: "#000000",
        offset: "100%",
        opacity: "1",
      },
    ];

    stops.forEach(function (item) {
      var stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop.setAttribute("offset", item.offset);
      stop.setAttribute("stop-color", item.color);
      stop.setAttribute("fill-opacity", item.opacity);
      linearGradient.appendChild(stop);
    });
    this.g.appendChild(linearGradient);

    var animateTransform = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "animateTransform"
    );
    animateTransform.setAttribute("attributeName", "transform");
    animateTransform.setAttribute("type", "rotate");
    animateTransform.setAttribute("from", "0 64 64");
    animateTransform.setAttribute("to", "360 64 64");
    animateTransform.setAttribute("dur", "1080ms");
    animateTransform.setAttribute("repeatCount", "indefinite");
    this.g.appendChild(animateTransform);

    return this;
  };

  function generateDateTime(date) {
    if (!date) {
      this.time = new Date();
    } else {
      this.time = new Date(date);
    }

    this.returnTime = "";

    if (this.time.getHours().toString().length < 2) {
      this.returnTime += "0" + this.time.getHours();
    } else {
      this.returnTime += this.time.getHours();
    }

    if (this.time.getMinutes().toString().length < 2) {
      this.returnTime += "0" + this.time.getMinutes();
    } else {
      this.returnTime += this.time.getMinutes();
    }

    return this.returnTime;
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

  //Checks to see if s1 substring of length (s0.length) contains s0
  function containsSubString(s0, s1) {
    if (s0.length === s1.length) {
      return containsString(s0, s1);
    }
    return s1.slice(0, s0.length).toLowerCase().indexOf(s0.toLowerCase()) > -1;
  }

  /*Checks to see if s0 contains to s1*/
  function containsString(s0, s1) {
    return s0.toLowerCase().indexOf(s1.toLowerCase()) > -1;
  }

  /*Uses containsString to check to see if the two strings are equal*/
  function compareString(s0, s1) {
    return containsString(s0, s1) && containsString(s1, s0);
  }

  function generateId() {
    return Math.floor(Math.random() * 1000);
  }

  //Show the history and on fail display "No Messages" in the history view

  function retrieveHistory(table, rowIndex, internalColumn, cb, init, query) {
    var sandboxName = "History " + ctx.SiteTitle;
    if (init) {
      var url =
        ctx.HttpRoot +
        "/_api/web/lists/getbytitle('" +
        sandboxName +
        "')/items?$filter=Title eq '" +
        table +
        " - " +
        rowIndex +
        " - " +
        internalColumn +
        "'&$orderby=Created desc&$top=1";
    } else {
      var url =
        ctx.HttpRoot +
        "/_api/web/lists/getbytitle('" +
        sandboxName +
        "')/items?$filter=Title eq '" +
        table +
        " - " +
        rowIndex +
        " - " +
        internalColumn +
        "'&$orderby=Created desc";
    }

    $.ajax({
      url: url,
      type: "GET",
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        credentials: true,
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      },
      success: function (res) {
        cb(null, res.d.results);
      },
      error: cb,
    });
  }

  function findHistoryChat(cb, isNew) {
    var sandboxName = "History " + ctx.SiteTitle; //"Sandbox"
    var url =
      ctx.HttpRoot + "/_api/web/lists/getbytitle('" + sandboxName + "')";

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
        if (isNew) {
          cb(data.d.Id);
          return false;
        }
        cb(data.d.Id);
        return false;
      },
      error: function (error) {
        console.log("Error in the findHistoryChat:", error);
        makeList(sandboxName);
      },
    });
  }

  function getUserName(success, meatballHistory) {
    var url =
      ctx.HttpRoot + `/_api/SP.UserProfiles.PeopleManager/GetMyProperties`;
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
        var name = data.d.DisplayName;
        success(meatballHistory, name);
        return false;
      },
      error: function (error) {
        console.log("Error in the getting the current:", error);
      },
    });
  }

  function makeList(sandboxName) {
    var data = {
      __metadata: { type: "SP.List" },
      AllowContentTypes: true,
      BaseTemplate: 100,
      ContentTypesEnabled: true,
      Title: sandboxName,
    };

    var url = ctx.HttpRoot + "/_api/web/lists"; //this is dev env

    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(data),
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        credentials: true,
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      },
      success: function (data) {
        createMessageColumn(data.d.Id); //colName and rowId come from the cell
        return false;
      },
      error: function (error) {
        console.log("History list creation failed:", error);
      },
    });
  }

  function createMessageColumn(listId) {
    var data = {
      __metadata: { type: "SP.Field" },
      Title: "Message",
      FieldTypeKind: 2,
      Required: "false",
      EnforceUniqueValues: "false",
      StaticName: "Message",
    };

    var url = ctx.HttpRoot + "/_api/web/lists('" + listId + "')/Fields";

    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(data),
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        credentials: true,
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      },
      success: function (data) {
        createUserNameColumn(listId);
        return false;
      },
      error: function (error) {
        console.log("Message col creation failed:", error);
      },
    });
  }

  function createUserNameColumn(listId) {
    var data = {
      __metadata: { type: "SP.Field" },
      Title: "UserName",
      FieldTypeKind: 2,
      Required: "false",
      EnforceUniqueValues: "false",
      StaticName: "UserName",
    };

    var url = ctx.HttpRoot + "/_api/web/lists('" + listId + "')/Fields"; //this is dev env

    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(data),
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        credentials: true,
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      },
      success: function (data) {
        return false;
      },
      error: function (error) {
        console.log("UserName col creation failed:", error);
      },
    });
  }

  function makeHistory(
    listId,
    message,
    colName,
    rowId,
    tableGUID,
    currentUser,
    listEntrySuccess,
    autoBot
  ) {
    var data = {
      __metadata: { type: "SP.ListItem" },
      Message: message,
      Title: tableGUID + " - " + rowId + " - " + colName, //name of the status column that is passed
      UserName: currentUser,
    };

    var url = ctx.HttpRoot + "/_api/web/lists('" + listId + "')/items "; //this is dev env

    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(data),
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        credentials: true,
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
      },
      success: function (data) {
        if (autoBot) {
          return false;
        }
        listEntrySuccess(data.d);
        return false;
      },
      error: function (error) {
        console.log("History entry creation failed:", error);
      },
    });
  }

  function deleteHistory(listId, id) {
    var url =
      ctx.HttpRoot + "/_api/web/lists('" + listId + "')/items(" + id + ")"; //this is dev env

    $.ajax({
      url: url,
      type: "DELETE",
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        credentials: true,
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        "IF-MATCH": "*",
      },
      success: function (data) {
        return false;
      },
      error: function (error) {
        console.log("History entry deletion failed:", error);
      },
    });
  }

  function updateHistory(listId, id, message) {
    var data = {
      __metadata: { type: "SP.ListItem" },
      Message: message,
    };

    var url =
      ctx.HttpRoot + "/_api/web/lists('" + listId + "')/items(" + id + ")"; //this is dev env

    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(data),
      headers: {
        Accept: "application/json; odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        credentials: true,
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        "X-HTTP-Method": "MERGE",
        "IF-MATCH": "*",
      },
      success: function (data) {
        return false;
      },
      error: function (error) {
        console.log("History entry update failed:", error);
      },
    });
  }
})();
