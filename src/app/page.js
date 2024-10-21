"use client";

import "./app.css";
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons";
import { useState, useEffect, useRef, useCallback } from "react";
import { client } from "../lib/appwrite";
import { AppwriteException } from "appwrite";

export default function Home() {
  const [detailHeight, setDetailHeight] = useState(0);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showLogs, setShowLogs] = useState(false);

  const detailsRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (detailsRef.current) {
      setDetailHeight(detailsRef.current.clientHeight);
    }
  }, [logs, showLogs]);

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

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
    }
    setShowLogs(true);
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
              <g clip-path="url(#clip0_5861_17928)">
                <g clip-path="url(#clip1_5861_17928)">
                  <path
                    d="M14.9521 0.00861131C14.8833 0.0148665 14.6643 0.0367597 14.4673 0.0523976C9.92219 0.462113 5.66491 2.91415 2.96852 6.6829C1.46706 8.77839 0.506745 11.1554 0.143891 13.6731C0.0156403 14.5519 0 14.8115 0 16.0031C0 17.1947 0.0156403 17.4543 0.143891 18.3332C1.01349 24.3413 5.28954 29.3892 11.089 31.2595C12.1275 31.5942 13.2223 31.8225 14.4673 31.9601C14.9521 32.0133 17.0479 32.0133 17.5327 31.9601C19.6817 31.7224 21.5022 31.1907 23.2978 30.2743C23.573 30.1336 23.6262 30.0961 23.5887 30.0648C23.5636 30.046 22.3906 28.4729 20.983 26.5713L18.4242 23.1153L15.218 18.3707C13.4538 15.7623 12.0023 13.6293 11.9898 13.6293C11.9773 13.6262 11.9648 15.7342 11.9586 18.3082C11.9492 22.815 11.946 22.9964 11.8897 23.1028C11.8084 23.256 11.7458 23.3186 11.6145 23.3874C11.5144 23.4374 11.4268 23.4468 10.9544 23.4468H10.4133L10.2694 23.3561C10.1756 23.2967 10.1067 23.2185 10.0598 23.1278L9.99413 22.9871L10.0004 16.7162L10.0098 10.4423L10.1067 10.3203C10.1568 10.2546 10.2631 10.1702 10.3382 10.1295C10.4665 10.067 10.5165 10.0607 11.0577 10.0607C11.6958 10.0607 11.8022 10.0857 11.9679 10.2671C12.0149 10.3172 13.7509 12.9318 15.828 16.0813C17.905 19.2308 20.7453 23.5313 22.1404 25.6424L24.6741 29.4799L24.8023 29.3955C25.9378 28.6574 27.139 27.6065 28.0899 26.5119C30.1138 24.188 31.4182 21.3544 31.8561 18.3332C31.9844 17.4543 32 17.1947 32 16.0031C32 14.8115 31.9844 14.5519 31.8561 13.6731C30.9865 7.66496 26.7105 2.61703 20.911 0.746724C19.8882 0.415199 18.7996 0.186884 17.5797 0.0492701C17.2794 0.0179941 15.2117 -0.0164094 14.9521 0.00861131ZM21.5022 9.68539C21.6524 9.76045 21.7744 9.90432 21.8182 10.0544C21.8432 10.1358 21.8495 11.8747 21.8432 15.7936L21.8338 21.417L20.8422 19.897L19.8475 18.377V14.2892C19.8475 11.6464 19.86 10.1608 19.8788 10.0889C19.9288 9.9137 20.0383 9.77609 20.1885 9.69477C20.3167 9.62909 20.3636 9.62284 20.8547 9.62284C21.3177 9.62284 21.399 9.62909 21.5022 9.68539Z"
                    fill="#19191C"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_5861_17928">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
                <clipPath id="clip1_5861_17928">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
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
                <h2 className="heading-level-7">Head to Appwrite Cloud</h2>
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
                      <th className="table-thead-col" colSpan="5">
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
