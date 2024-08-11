import { calculateInvestmentResults, formatter } from "../util/investment";

export default function Result({information}) {
    const resultsData = calculateInvestmentResults(information);
    const initialInvestment = resultsData[0].valueEndOfYear - resultsData[0].interest - resultsData[0].annualInvestment;
    return (
        <table id="result" className="center">
            <thead id="result" >
                <tr>
                    <th>Year</th>
                    <th>Investment Value</th>
                    <th>Interst (Year)</th>
                    <th>Total interest</th>
                    <th>Invested capital</th>
                </tr>
            </thead>
            <tbody>
                {resultsData.map((yearData) => {
                    const totalInterest = yearData.valueEndOfYear - yearData.annualInvestment * yearData.year - initialInvestment
                    const totalAmaountInvested = yearData.valueEndOfYear - totalInterest;
                    return (
                        <tr key={yearData.year} className="center">
                            <td>{yearData.year}</td>
                            <td>{formatter.format(yearData.valueEndOfYear)}</td>
                            <td>{formatter.format(yearData.interest)}</td>
                            <td>{formatter.format(totalInterest)}</td>
                            <td>{formatter.format(totalAmaountInvested)}</td>
                        </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}