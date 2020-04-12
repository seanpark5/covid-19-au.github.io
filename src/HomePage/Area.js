import uuid from "react-uuid";
import React, { useState, useEffect } from "react";
import stateData from "../data/state";
import testedCases from "../data/testedCases";
// import i18n bundle
import i18next from '../i18n';
import { A } from "hookrouter";

const CONFIRMED = 1;
const DEATH = 2;
const CURED = 3;
const TESTED = 4;

export default function Area({ area, onChange, data }) {
  let totalRecovered = 0;
  for (let i = 0; i < data.length; i++) {
    totalRecovered += parseInt(data[i][3]);
  }
  let lastTotal =
    stateData[Object.keys(stateData)[Object.keys(stateData).length - 1]];

  const getAriaLabel = (state, confirmed, death, recovered, tested) => {
    return `In ${state
      .split("")
      .join(
        " "
      )}, there were ${confirmed} confirmed cases. Out of them, ${death} unfortunately resulted in death.

    ${recovered} recovered and ${tested} were tested`;
  };

  const [fill, setFill] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFill(!fill);
    }, 800);
    return () => clearTimeout(timer);
  }, [fill]);

  const renderArea = () => {
    let latest =
      testedCases[
        Object.keys(testedCases)[Object.keys(testedCases).length - 1]
      ];

    return data.map((x) => (
      <div
        role={"button"}
        aria-label={getAriaLabel(...x)}
        aria-describedby={getAriaLabel(...x)}
        className="province"
        key={uuid()}
      >
        {/*<div className={`area ${x.name ? 'active' : ''}`}>*/}
        {/*{ x.name || x.cityName }*/}
        {/*</div>*/}
        {/*<div className="confirmed">{ x.confirmedCount }</div>*/}
        {/*<div className="death">{ x.deadCount }</div>*/}
        {/*<div className="cured">{ x.curedCount }</div>*/}
        <div className={"area"}>
          <A href={`/state/${x[0].toLowerCase()}`} onClick={()=>{window.scrollTo(0, 0);}}>
            <strong>
                <u>{i18next.t("homePage:state."+x[0])}</u>{" "}

                <svg
                  className="bi bi-caret-right-fill"
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 011.659-.753l5.48 4.796a1 1 0 010 1.506z" />
                </svg>

            </strong>
          </A>
        </div>
        <div className="confirmed">
          <strong>{numberWithCommas(x[CONFIRMED])}</strong>&nbsp;
          <div className="dailyIncrease">
            {x[CONFIRMED] - lastTotal[x[0]][0] > 0
              ? `(+${x[1] - lastTotal[x[0]][0]})`
              : null}
          </div>
        </div>
        <div className="death">
          <strong>{numberWithCommas(x[DEATH])}</strong>&nbsp;
          <div className="dailyIncrease">
            {x[DEATH] - lastTotal[x[0]][1] > 0
              ? ` (+${x[2] - lastTotal[x[0]][1]})`
              : null}
          </div>
        </div>
        <div className="cured">
          <strong>{(x[0]==="NSW")?<div style={{fontWeight:'normal', color:'grey'}}>N/A</div>:numberWithCommas(x[CURED])}</strong>&nbsp;
          <div className="dailyIncrease">
            {x[CURED] - lastTotal[x[0]][2] > 0
              ? `(+${x[3] - lastTotal[x[0]][2]})`
              : null}
          </div>
        </div>
        <div className="tested">{numberWithCommas(x[TESTED])}</div>
      </div>
    ));
  };

  const Total = ({ data }) => {
    const sumRow = (index, data) =>
      data.reduce((total, row) => {
        const val = +row[index] || 0;
        return total + val;
      }, 0);

    return (
      <div className="province table-footer">
        <div className="area">{i18next.t("homePage:status.total")}</div>
        <div className="confirmed">
          {numberWithCommas(sumRow(CONFIRMED, data))}
        </div>
        <div className="death">{numberWithCommas(sumRow(DEATH, data))}</div>
        <div className="cured">*3200+</div>
        <div className="tested">{numberWithCommas(sumRow(TESTED, data))}</div>
      </div>
    );
  };

  return (
    <div role={"table"}>
      <div className="province header">
        <div className="area header statetitle">{i18next.t("homePage:caseByState.state")}</div>
        <div className="confirmed header confirmedtitle">{i18next.t("homePage:status.confirm")}</div>
        <div className="death header deathtitle">{i18next.t("homePage:status.death")}</div>
        <div className="cured header recoveredtitle">{i18next.t("homePage:status.recover")}</div>
        <div className="tested header testedtitle">{i18next.t("homePage:status.tested")}</div>
      </div>
      {renderArea()}
      <Total data={data} />

      <span className="due" style={{ fontSize: "80%", padding: 0 }}>
      {i18next.t("homePage:caseByState.append1")}
      </span>
        <br/>
        <span className="due" style={{ fontSize: "80%", padding: 0 }}>
        {i18next.t("homePage:caseByState.append2")}<strong>{i18next.t("homePage:caseByState.state")}</strong> {i18next.t("homePage:caseByState.append3")}.
      </span>
    </div>
  );
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
