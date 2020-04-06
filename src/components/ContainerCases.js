import React from "react";
import { objectOf } from "prop-types";

// import { Container } from './styles';

export default function ContainerCases({ data, type, totalCases, order }) {
  const color = type === "recovered" ? "yellowgreen" : "#bdbdbd";

  function formatNumber(number) {
    return new Intl.NumberFormat("pt-BR").format(number);
  }
  return (
    <div className="contentCases">
      <div>
        <small>{`Total ${type.replace(/^[a-z]/g, (l) =>
          l.toUpperCase()
        )}`}</small>
        <p style={{ color: `${color}` }}>{formatNumber(totalCases)}</p>
      </div>
      <ul>
        {data
          ?.sort((a, b) => (`${a}.${type}` > `${b}.${type}` ? -1 : 1))
          .map((c) => (
            <li key={c.country}>
              <div className="CountryCases">
                <span style={{ color: `${color}` }}>
                  {formatNumber(Object.values(c)[`${order}`])} {type}
                </span>
                <span>{c.country}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
