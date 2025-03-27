import { useState } from "react";

export default function SalesPricingApp() {
  const [width, setWidth] = useState(30);
  const [length, setLength] = useState(60);
  const [nonStandard, setNonStandard] = useState(false);
  const [blockRows, setBlockRows] = useState(1);
  const [city, setCity] = useState("");
  const [driveTime, setDriveTime] = useState(0);
  const [megaDomeMSRP, setMegaDomeMSRP] = useState(0);
  const [blockWeightKg, setBlockWeightKg] = useState(0);

  const sqft = width * length;
  const ratePerSqft = nonStandard ? 5.5 : 5;
  const baseInstallCost = sqft * ratePerSqft;

  const sqftPerWeek = 1800;
  const weeksNeeded = Math.ceil(sqft / sqftPerWeek);

  const crewSize = 3;
  const travelCost = driveTime > 3 ? (crewSize * 250 * weeksNeeded) : 0;

  const telehandlerCost = 1500;
  const blockInstallDays = Math.ceil((2 * width + 2 * length) / (2 * 30 + 2 * 60));
  const blockInstallCost = blockInstallDays * 2000 * blockRows;
  const blockTravelCost = driveTime > 3 ? crewSize * 250 * blockInstallDays : 0;

  const blockLoads = Math.ceil(blockWeightKg / 85000);
  const isNorthOfBarrie = false;
  const blockMaterialCost = isNorthOfBarrie ? 2300 : 2000;
  const blockMaterialTotal = blockLoads * blockMaterialCost;
  const totalBlockCost = telehandlerCost + blockInstallCost + blockTravelCost + blockMaterialTotal;

  const isNorthOfNorthBay = false;
  const domeShippingCost = isNorthOfNorthBay ? 0 : 3000;

  let discountRate = 0.38;
  if (megaDomeMSRP >= 500000) discountRate = 0.45;
  else if (megaDomeMSRP >= 300000) discountRate = 0.44;
  else if (megaDomeMSRP >= 100000) discountRate = 0.42;
  else if (megaDomeMSRP >= 50000) discountRate = 0.40;

  const coverItCost = megaDomeMSRP * (1 - discountRate);
  const salesPrice = (coverItCost * 1.2) + 3000;

  const handleDistanceLookup = async () => {
    if (typeof window === "undefined") return;
    const origin = "2000 Chemong Rd, Peterborough, ON";
    const destination = city;
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&units=metric&key=${apiKey}`
    );

    const data = await response.json();
    if (data.rows[0].elements[0].status === "OK") {
      const durationInSeconds = data.rows[0].elements[0].duration.value;
      setDriveTime((durationInSeconds / 3600).toFixed(2));
    } else {
      alert("Unable to calculate distance. Please check the city name.");
    }
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <img src="/coverit-logo.png" alt="CoverIt Canada" className="mb-6 h-12" />
      <h1 className="text-3xl font-bold mb-6">CoverIt Canada Sales Pricing App</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label>Job Site City/Town: </label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="border px-2 py-1 w-full" />
          <button onClick={handleDistanceLookup} className="bg-blue-600 text-white px-4 py-2 mt-2">Get Travel Time</button>
        </div>

        <div>
          <label>Estimated Drive Time (hrs): </label>
          <input type="number" value={driveTime} readOnly className="border px-2 py-1 w-full" />
        </div>

        <div>
          <label>Width (ft): </label>
          <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} className="border px-2 py-1 w-full" />
        </div>

        <div>
          <label>Length (ft): </label>
          <input type="number" value={length} onChange={(e) => setLength(+e.target.value)} className="border px-2 py-1 w-full" />
        </div>

        <div>
          <label>Non-Standard Features: </label>
          <input type="checkbox" checked={nonStandard} onChange={(e) => setNonStandard(e.target.checked)} className="ml-2" />
        </div>

        <div>
          <label>Rows of Concrete Block: </label>
          <input type="number" min={1} max={3} value={blockRows} onChange={(e) => setBlockRows(+e.target.value)} className="border px-2 py-1 w-full" />
        </div>

        <div>
          <label>Total Block Weight (kg): </label>
          <input type="number" value={blockWeightKg} onChange={(e) => setBlockWeightKg(+e.target.value)} className="border px-2 py-1 w-full" />
        </div>

        <div>
          <label>MegaDome MSRP ($): </label>
          <input type="number" value={megaDomeMSRP} onChange={(e) => setMegaDomeMSRP(+e.target.value)} className="border px-2 py-1 w-full" />
        </div>
      </div>

      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Pricing Summary</h2>
        <p>Total Sqft: {sqft} sqft</p>
        <p>Dome Installation Cost: ${baseInstallCost.toFixed(2)}</p>
        {driveTime > 3 && <p>Travel/Accommodation Cost (Dome): ${travelCost.toFixed(2)}</p>}
        <p>Dome Shipping Cost: ${domeShippingCost.toFixed(2)}</p>
        <p><strong>Total Dome Install + Shipping: ${(baseInstallCost + travelCost + domeShippingCost).toFixed(2)}</strong></p>

        <p className="mt-4">Block Install Days: {blockInstallDays} day(s)</p>
        <p>Block Installation Cost: ${blockInstallCost.toFixed(2)}</p>
        {driveTime > 3 && <p>Travel/Accommodation Cost (Block): ${blockTravelCost.toFixed(2)}</p>}
        <p>Block Loads Required: {blockLoads}</p>
        <p>Block Material Cost (Per Load): ${blockMaterialCost.toFixed(2)}</p>
        <p><strong>Total Block Cost: ${totalBlockCost.toFixed(2)}</strong></p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold">MegaDome Pricing</h3>
          <p>Discount Rate: {(discountRate * 100).toFixed(0)}%</p>
          <p>CoverIt Cost: ${coverItCost.toFixed(2)}</p>
          <p><strong>Final Sales Price (incl. 20% margin + $3000 shipping): ${salesPrice.toFixed(2)}</strong></p>
        </div>
      </div>
    </div>
  );
}