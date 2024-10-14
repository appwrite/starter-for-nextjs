"use client";

import "./app.css";
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons";
import { useState, useEffect, useRef } from "react";
import { client } from "../lib/appwrite";
import { AppwriteException } from "node-appwrite";

export default function Home() {
  const [detailHeight, setDetailHeight] = useState(0);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("success");
  const [showLogs, setShowLogs] = useState(false);

  const detailsRef = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (detailsRef.current) {
        setDetailHeight(detailsRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  async function sendPing() {
    if (status === "loading") return;
    setStatus("loading");
    try {
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("success");
    } catch (err) {
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: err instanceof AppwriteException ? err.code : 500,
        response:
          err instanceof AppwriteException
            ? err.message
            : "Something went wrong",
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("error");
    } finally {
      setShowLogs(true);
    }
  }

  return (
    <main
      className="u-flex u-flex-vertical u-padding-20 u-cross-center u-gap-32 checker-background"
      style={{ marginBottom: `${detailHeight}px` }}
    >
      <div className="connection-visual">
        <div className="outer-card">
          <div className="inner-card">
            <svg
              width="72"
              height="72"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.1611 4.23322C24.3168 -0.0234282 18.6541 -1.2706 14.5833 1.41353L7.4071 6.18531C5.44997 7.45959 4.09302 9.54725 3.70159 11.906C3.36235 13.8852 3.6494 15.9187 4.56273 17.681C3.93645 18.657 3.51892 19.7415 3.33626 20.8802C2.91873 23.2932 3.46673 25.7876 4.82368 27.7668C7.69415 32.0234 13.3307 33.2706 17.4016 30.5865L24.5777 25.8418C26.5349 24.5675 27.8918 22.4799 28.2832 20.1211C28.6225 18.1419 28.3354 16.1084 27.4221 14.3461C28.0484 13.3701 28.4659 12.2856 28.6486 11.1469C29.0922 8.70676 28.5442 6.21242 27.1611 4.23322Z"
                fill="#FF3E00"
              />
              <path
                d="M13.797 28.6159C11.3759 29.2212 8.84601 28.3001 7.43146 26.3264C6.56096 25.1684 6.23453 23.721 6.47935 22.3C6.53376 22.0631 6.58817 21.8526 6.64257 21.6157L6.77859 21.1947L7.15943 21.4578C8.05713 22.0894 9.03643 22.5631 10.0973 22.8789L10.3694 22.9579L10.3422 23.221C10.315 23.5895 10.4238 23.9842 10.6414 24.3C11.0767 24.9053 11.8383 25.1948 12.5728 25.0105C12.736 24.9579 12.8993 24.9053 13.0353 24.8263L20.4889 20.2209C20.8697 19.9841 21.1145 19.642 21.1962 19.2209C21.2778 18.7999 21.169 18.3525 20.9241 18.0104C20.4889 17.4051 19.7272 17.1419 18.9927 17.3261C18.8295 17.3788 18.6663 17.4314 18.5303 17.5104L15.674 19.2736C15.2115 19.563 14.6946 19.7736 14.1506 19.9052C11.7295 20.5104 9.19965 19.5894 7.7851 17.6156C6.9418 16.4577 6.58817 15.0103 6.8602 13.5892C7.10502 12.2207 7.97552 10.9839 9.19965 10.247L16.6805 5.64161C17.1429 5.35213 17.6598 5.1416 18.2038 4.9837C20.6249 4.37842 23.1548 5.2995 24.5693 7.27323C25.4398 8.43116 25.7663 9.87856 25.5214 11.2997C25.467 11.5365 25.4126 11.747 25.331 11.9839L25.195 12.4049L24.8142 12.1418C23.9165 11.5102 22.9371 11.0365 21.8762 10.7207L21.6042 10.6417L21.6314 10.3786C21.6586 10.0101 21.5498 9.6154 21.3322 9.2996C20.8969 8.69432 20.1352 8.43116 19.4008 8.61537C19.2375 8.66801 19.0743 8.72064 18.9383 8.79959L11.4847 13.405C11.1039 13.6418 10.859 13.9839 10.7774 14.405C10.6958 14.8261 10.8046 15.2734 11.0495 15.6156C11.4847 16.2208 12.2464 16.484 12.9809 16.2998C13.1441 16.2472 13.3073 16.1945 13.4433 16.1156L16.2996 14.3524C16.7621 14.0629 17.2789 13.8524 17.823 13.6945C20.2441 13.0892 22.7739 14.0103 24.1885 15.984C25.059 17.1419 25.3854 18.5893 25.1406 20.0104C24.8958 21.3789 24.0253 22.6157 22.8011 23.3526L15.3203 27.958C14.8579 28.2475 14.341 28.458 13.797 28.6159Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
        <div
          className="connection-line"
          style={{
            opacity: status === "success" ? 1 : 0,
            transition: "opacity 2.5s",
          }}
        >
          <div className="line-left"></div>
          <div
            className="u-flex u-main-center u-border-radius-circle tick-container icon-check"
            style={{ color: "#fd366e" }}
          ></div>
          <div className="line-right"></div>
        </div>
        <div className="outer-card">
          <div className="inner-card">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M71.9999 52.1996V68.3996H31.6713C19.9219 68.3996 9.663 61.8843 4.17426 52.1996C3.37635 50.7917 2.67799 49.3145 2.09218 47.7814C0.942204 44.7771 0.219318 41.5533 0 38.1895V33.8097C0.0476152 33.06 0.122645 32.3163 0.220761 31.5814C0.421322 30.0733 0.724328 28.5977 1.12256 27.1632C4.88994 13.5641 17.14 3.59961 31.6713 3.59961C46.2026 3.59961 58.4512 13.5641 62.2186 27.1632H44.9747C42.1438 22.7303 37.2437 19.7996 31.6713 19.7996C26.0989 19.7996 21.1989 22.7303 18.3679 27.1632C17.5051 28.5108 16.8356 29.9968 16.3969 31.5814C16.0074 32.9864 15.7996 34.468 15.7996 35.9996C15.7996 40.6431 17.7129 44.8286 20.7804 47.7814C23.6229 50.5222 27.4552 52.1996 31.6713 52.1996H71.9999Z"
                fill="#FD366E"
              />
              <path
                d="M72.0002 31.583V47.783H42.5625C45.6301 44.8302 47.5433 40.6447 47.5433 36.0012C47.5433 34.4696 47.3356 32.988 46.946 31.583H72.0002Z"
                fill="#FD366E"
              />
            </svg>
          </div>
        </div>
      </div>

      <section
        className="u-flex u-flex-vertical u-main-center u-cross-center u-padding-16"
        style={{ backdropFilter: "blur(1px)" }}
      >
        {status === "loading" ? (
          <div className="u-flex u-cross-center u-gap-16">
            <div className="loader is-small"></div>
            <h1 className="heading-level-7">Waiting for connection...</h1>
          </div>
        ) : status === "success" ? (
          <h1 className="heading-level-5">Congratulations!</h1>
        ) : (
          <h1 className="heading-level-5">Check connection</h1>
        )}

        <p className="body-text-2 u-text-center">
          {status === "success" ? (
            <span>You connected your app successfully.</span>
          ) : status === "error" || status === "idle" ? (
            <span>Send a ping to verify the connection</span>
          ) : null}
        </p>

        <button
          onClick={sendPing}
          className="button u-margin-block-start-32"
          style={{ visibility: status === "loading" ? "hidden" : "visible" }}
        >
          <span>Send a ping</span>
        </button>
      </section>

      <nav className="u-grid">
        <ul className="u-flex u-flex-wrap u-main-center u-gap-32">
          <li
            className="card u-max-width-300 u-flex-vertical u-gap-8"
            style={{ "--p-card-padding": "1em" }}
          >
            <h2 className="heading-level-7">Edit your app</h2>
            <p className="body-text-2">
              Edit <code className="inline-code">app/page.js</code> to get
              started with building your app
            </p>
          </li>
          <li
            className="card u-max-width-300"
            style={{ "--p-card-padding": "1em" }}
          >
            <a
              href="https://cloud.appwrite.io"
              target="_blank"
              rel="noopener noreferrer"
              className="u-flex-vertical u-gap-8"
            >
              <div className="u-flex u-main-space-between u-cross-center">
                <h2 className="heading-level-7">Go to console</h2>
                <span
                  className="icon-arrow-right"
                  style={{ color: "hsl(var(--color-neutral-15))" }}
                ></span>
              </div>
              <p className="body-text-2">
                Start managing your project from the Appwrite console
              </p>
            </a>
          </li>
          <li
            className="card u-max-width-300"
            style={{ "--p-card-padding": "1em" }}
          >
            <a
              href="https://appwrite.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="u-flex-vertical u-gap-8"
            >
              <div className="u-flex u-main-space-between u-cross-center">
                <h2 className="heading-level-7">Explore docs</h2>
                <span
                  className="icon-arrow-right"
                  style={{ color: "hsl(var(--color-neutral-15))" }}
                ></span>
              </div>
              <p className="body-text-2">
                Discover the full power of Appwrite by diving into our
                documentation
              </p>
            </a>
          </li>
        </ul>
      </nav>

      <aside
        className="collapsible u-width-full-line u-position-fixed"
        style={{ border: "1px solid hsl(var(--color-neutral-10))", bottom: 0 }}
      >
        <div className="collapsible-item">
          <details
            className="collapsible-wrapper u-padding-0"
            style={{ backgroundColor: "hsl(var(--color-neutral-0))" }}
            open={showLogs}
            ref={detailsRef}
          >
            <summary className="collapsible-button u-padding-16">
              <span className="text">Logs</span>
              {logs.length > 0 && (
                <span className="collapsible-button-optional">
                  <span className="inline-tag">
                    <span className="text">{logs.length}</span>
                  </span>
                </span>
              )}
              <div className="icon">
                <span className="icon-cheveron-down" aria-hidden="true"></span>
              </div>
            </summary>
            <div className="collapsible-content u-flex u-flex-vertical-mobile u-cross-stretch u-padding-0">
              <div
                className="table is-table-row-medium-size u-stretch"
                style={{ "--p-border-radius": 0, inlineSize: "unset" }}
              >
                <div
                  className="table-thead"
                  style={{ backgroundColor: "hsl(var(--color-neutral-5))" }}
                >
                  <div className="table-row">
                    <div className="table-thead-col">
                      <span className="u-color-text-offline">Project</span>
                    </div>
                  </div>
                </div>
                <div
                  className="grid-box u-padding-16"
                  style={{
                    "--grid-gap": "2rem",
                    "--grid-item-size-small-screens": "10rem",
                    "--grid-item-size": "10rem",
                    backgroundColor: "hsl(var(--color-neutral-0))",
                  }}
                >
                  <div className="u-grid u-grid-vertical u-gap-8">
                    <p className="u-color-text-offline">Endpoint</p>
                    <p className="body-text-2">
                      {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}
                    </p>
                  </div>
                  <div className="u-grid u-grid-vertical u-gap-8">
                    <p className="u-color-text-offline">Project ID</p>
                    <p className="body-text-2">
                      {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}
                    </p>
                  </div>
                  <div className="u-grid u-grid-vertical u-gap-8">
                    <p className="u-color-text-offline">Project name</p>
                    <p className="body-text-2">
                      {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME}
                    </p>
                  </div>
                  <div className="u-grid u-grid-vertical u-gap-8">
                    <p className="u-color-text-offline">Version</p>
                    <p className="body-text-2">
                      {process.env.NEXT_PUBLIC_APPWRITE_VERSION}
                    </p>
                  </div>
                </div>
              </div>

              <table
                className="table is-table-row-small-size"
                style={{ "--p-border-radius": 0, flex: 2 }}
              >
                <thead
                  className="table-thead"
                  style={{ backgroundColor: "hsl(var(--color-neutral-5))" }}
                >
                  <tr
                    className="table-row u-grid"
                    style={{
                      gridTemplateColumns: "3fr 2fr 2fr 2fr 5fr",
                      minBlockSize: "unset",
                    }}
                  >
                    {logs.length > 0 ? (
                      <>
                        <th className="table-thead-col">
                          <span className="u-color-text-offline">Date</span>
                        </th>
                        <th className="table-thead-col">
                          <span className="u-color-text-offline">Status</span>
                        </th>
                        <th className="table-thead-col">
                          <span className="u-color-text-offline">Method</span>
                        </th>
                        <th className="table-thead-col">
                          <span className="u-color-text-offline">Path</span>
                        </th>
                        <th className="table-thead-col">
                          <span className="u-color-text-offline">Response</span>
                        </th>
                      </>
                    ) : (
                      <th className="table-thead-col">
                        <span className="u-color-text-offline">Logs</span>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody
                  className="table-tbody u-flex u-flex-vertical u-font-code u-overflow-y-auto"
                  style={{ maxHeight: "16em" }}
                >
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <tr
                        key={index}
                        className="table-row u-grid u-height-auto"
                        style={{
                          gridTemplateColumns: "3fr 2fr 2fr 2fr 5fr",
                          minBlockSize: "unset",
                        }}
                      >
                        <td
                          className="table-col u-flex u-cross-center"
                          data-title="Date"
                        >
                          <time className="text">
                            {log.date.toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </td>
                        <td
                          className="table-col u-flex u-cross-center"
                          data-title="Status"
                        >
                          <span
                            className={`tag ${
                              log.status >= 400 ? "is-warning" : "is-success"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td
                          className="table-col u-flex u-cross-center"
                          data-title="Method"
                        >
                          <span className="text">{log.method}</span>
                        </td>
                        <td
                          className="table-col u-flex u-cross-center"
                          data-title="Path"
                        >
                          <span className="text">{log.path}</span>
                        </td>
                        <td
                          className="table-col u-flex u-cross-center"
                          data-title="Response"
                        >
                          <code className="inline-code u-un-break-text u-overflow-x-auto">
                            {log.response}
                          </code>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr
                      className="table-row u-height-auto"
                      style={{ minBlockSize: "unset" }}
                    >
                      <td colSpan="5">
                        <p className="u-color-text-offline u-padding-16">
                          There are no logs to show
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </aside>
    </main>
  );
}
