
import { useState } from "react";

export default function SalesPricingApp() {
  const [width, setWidth] = useState(30);
  const [length, setLength] = useState(60);
  const [nonStandard, setNonStandard] = useState(false);
  const [blockRows, setBlockRows] = useState(1);
  const [distanceFromHome, setDistanceFromHome] = useState(2.5);
  const [isNorthOfNorthBay, setIsNorthOfNorthBay] = useState(false);
  const [isNorthOfBarrie, setIsNorthOfBarrie] = useState(false);

  const sqft = width * length;

  // Installation cost logic
  const ratePerSqft = nonStandard ? 5.5 : 5;
  const baseInstallCost = sqft * ratePerSqft;

  // Crew duration
  const sqftPerWeek = 1800;
  const weeksNeeded = Math.ceil(sqft / sqftPerWeek);

  // Travel & accommodation costs if over 3 hrs
  const crewSize = 3;
  const travelCost = distanceFromHome > 3 ? (crewSize * 250 * weeksNeeded) : 0;

  // Block install cost
  const telehandlerCost = 1500;
  const blockInstallDays = Math.ceil((2 * width + 2 * length) / (2 * 30 + 2 * 60));
  const blockInstallCost = blockInstallDays * 2000 * blockRows;
  const blockTravelCost = distanceFromHome > 3 ? crewSize * 250 * blockInstallDays : 0;
  const totalBlockCost = telehandlerCost + blockInstallCost + blockTravelCost;

  // Dome shipping cost logic
  const domeShippingCost = isNorthOfNorthBay ? 0 : 3000;

  // Block material cost logic
  const blockMaterialCost = isNorthOfBarrie ? 2300 : 2000;

  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">CoverIt Canada Sales Pricing App</h1>

      <div className="space-y-4">
        <div>
          <label>Width (ft): </label>
          <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} className="border px-2 py-1" />
        </div>

        <div>
          <label>Length (ft): </label>
          <input type="number" value={length} onChange={(e) => setLength(+e.target.value)} className="border px-2 py-1" />
        </div>

        <div>
          <label>Non-Standard Features: </label>
          <input type="checkbox" checked={nonStandard} onChange={(e) => setNonStandard(e.target.checked)} />
        </div>

        <div>
          <label>Rows of Concrete Block: </label>
          <input type="number" min={1} max={3} value={blockRows} onChange={(e) => setBlockRows(+e.target.value)} className="border px-2 py-1" />
        </div>

        <div>
          <label>Distance from Home Base (hrs): </label>
          <input type="number" step={0.1} value={distanceFromHome} onChange={(e) => setDistanceFromHome(+e.target.value)} className="border px-2 py-1" />
        </div>

        <div>
          <label>North of North Bay: </label>
          <input type="checkbox" checked={isNorthOfNorthBay} onChange={(e) => setIsNorthOfNorthBay(e.target.checked)} />
        </div>

        <div>
          <label>North of Barrie: </label>
          <input type="checkbox" checked={isNorthOfBarrie} onChange={(e) => setIsNorthOfBarrie(e.target.checked)} />
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold">Pricing Summary</h2>
          <p>Total Sqft: {sqft} sqft</p>
          <p>Dome Installation Cost: ${baseInstallCost.toFixed(2)}</p>
          {distanceFromHome > 3 && <p>Travel/Accommodation Cost (Dome): ${travelCost.toFixed(2)}</p>}
          <p>Dome Shipping Cost: ${domeShippingCost.toFixed(2)}</p>
          <p><strong>Total Dome Install + Shipping: ${(baseInstallCost + travelCost + domeShippingCost).toFixed(2)}</strong></p>

          <p className="mt-4">Block Install Days: {blockInstallDays} day(s)</p>
          <p>Block Installation Cost: ${blockInstallCost.toFixed(2)}</p>
          {distanceFromHome > 3 && <p>Travel/Accommodation Cost (Block): ${blockTravelCost.toFixed(2)}</p>}
          <p>Block Material Cost (Per Load): ${blockMaterialCost.toFixed(2)}</p>
          <p><strong>Total Block Cost: ${(totalBlockCost + blockMaterialCost).toFixed(2)}</strong></p>
        </div>
      </div>
    </div>
  );
}
