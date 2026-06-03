import { LINKS, LOCATIONS, OPERATING_HOURS } from "../menuData";

export function HoursAndLocations() {
  return (
    <section className="hours-block" id="hours" aria-labelledby="hours-heading">
      <h2 id="hours-heading">Hours & locations</h2>
      <p className="hours-block__note">
        Operating hours are the same at both our Enumclaw and Maple Valley
        locations (see{" "}
        <a href={LINKS.locations}>burgerbudspnw.com/locations</a>).
      </p>
      <table className="hours-table">
        <tbody>
          {OPERATING_HOURS.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="locations">
        {LOCATIONS.map((loc) => (
          <div key={loc.id} className="location-card">
            <h3>{loc.name}</h3>
            {loc.lines.map((line, i) => (
              <p key={`${loc.id}-${i}`}>{line}</p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
