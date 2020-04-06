import React from "react";

// import { Container } from './styles';

export default function ContainerTotalCases({ data, totalCases }) {
  return (
    <>
      <div className="TotalCases">
        <small>Total Confirmed</small>
        <p>{new Intl.NumberFormat("pt-BR").format(totalCases.cases)}</p>
      </div>
      <div className="countryCases">
        <p>Confirmed Cases by Country/Region/Sovereignty</p>
        <ul>
          {data
            ?.sort((a, b) => (a.cases > b.cases ? -1 : 1))
            .map((c) => (
              <li key={c.country}>
                <div>
                  <span>{new Intl.NumberFormat("pt-BR").format(c.cases)}</span>
                  <span>{c.country}</span>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
