                    {s === "Quality score" && (
                      <div className="mt-2 rounded border border-slate-200 bg-white px-2 py-1">
                        <div className="font-semibold text-[11px] text-slate-900">Formula</div>
                        <div className="mt-1 text-[13px] font-mono leading-6 text-slate-800">
                          <div className="grid w-full grid-rows-2 grid-cols-5 items-center gap-x-3">
                            <div className="row-span-2 self-center">Q<sub>score</sub> =</div>
                            <div className="self-end text-center" style={{ gridColumn: 2, gridRow: 1 }}>
                              <span style={{ color: qualityColors[0] }}>W</span>
                              <sub style={{ color: qualityColors[0] }}>roe</sub>·Roe
                            </div>
                            <div className="self-end text-center" style={{ gridColumn: 3, gridRow: 1 }}>
                              <span style={{ color: qualityColors[1] }}>W</span>
                              <sub style={{ color: qualityColors[1] }}>roa</sub>·Roa
                            </div>
                            <div className="self-end text-center" style={{ gridColumn: 4, gridRow: 1 }}>
                              <span style={{ color: qualityColors[2] }}>W</span>
                              <sub style={{ color: qualityColors[2] }}>opm</sub>·Op_margin
                            </div>
                            <div className="self-end text-center" style={{ gridColumn: 5, gridRow: 1 }}>
                              <span style={{ color: qualityColors[3] }}>W</span>
                              <sub style={{ color: qualityColors[3] }}>piot</sub>·Piot
                            </div>
                            <div
                              className="self-start text-center text-[11px]"
                              style={{ color: qualityColors[0], gridColumn: 2, gridRow: 2 }}
                            >
                              ({(qualityWeights.wroe / 100).toFixed(2)})
                            </div>
                            <div
                              className="self-start text-center text-[11px]"
                              style={{ color: qualityColors[1], gridColumn: 3, gridRow: 2 }}
                            >
                              ({(qualityWeights.wroa / 100).toFixed(2)})
                            </div>
                            <div
                              className="self-start text-center text-[11px]"
                              style={{ color: qualityColors[2], gridColumn: 4, gridRow: 2 }}
                            >
                              ({(qualityWeights.wopm / 100).toFixed(2)})
                            </div>
                            <div
                              className="self-start text-center text-[11px]"
                              style={{ color: qualityColors[3], gridColumn: 5, gridRow: 2 }}
                            >
                              ({(qualityWeights.wpiot / 100).toFixed(2)})
                            </div>
                          </div>
                        </div>
                        <div
                          className="mt-2 px-1"
                          onMouseDown={(e) => {
                            // Evita che il drag&drop delle card interferisca con il trascinamento degli handle
                            e.stopPropagation();
                          }}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          <Range
                            min={0}
                            max={100}
                            step={1}
                            value={qualityHandles}
                            allowCross={false}
                            pushable={1}
                            onChange={(vals: number | number[]) => {
                              if (Array.isArray(vals) && vals.length === 3) setQualityHandles(vals as number[]);
                            }}
                            trackStyle={qualityHandles.map(() => ({ backgroundColor: "transparent" }))}
                            handleStyle={qualityHandles.map(() => ({
                              borderColor: "#0ea5e9",
                              backgroundColor: "#fff",
                              width: 16,
                              height: 16,
                              marginTop: -6,
                              boxShadow: "0 0 0 2px rgba(14,165,233,0.25)",
                            }))}
                            railStyle={{
                              background: `linear-gradient(90deg,
                                ${qualityColors[0]} 0%,
                                ${qualityColors[0]} ${qualityHandles[0]}%,
                                ${qualityColors[1]} ${qualityHandles[0]}%,
                                ${qualityColors[1]} ${qualityHandles[1]}%,
                                ${qualityColors[2]} ${qualityHandles[1]}%,
                                ${qualityColors[2]} ${qualityHandles[2]}%,
                                ${qualityColors[3]} ${qualityHandles[2]}%,
                                ${qualityColors[3]} 100%)`,
                            }}
                          />
                        </div>
                        <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-2 py-2 text-[12px] text-slate-700">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={qualityFilterEnabled}
                              onChange={(e) => setQualityFilterEnabled(e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                            />
                            <span>Lista solo i tick con Quality score sopra/sotto soglia</span>
                          </label>
                          {qualityFilterEnabled && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1 text-[11px]">
                                  <input
                                    type="radio"
                                    name="quality-comp"
                                    value="GT"
                                    checked={qualityFilterComp === "GT"}
                                    onChange={() => setQualityFilterComp("GT")}
                                  />
                                  <span>&gt;</span>
                                </label>
                                <label className="flex items-center gap-1 text-[11px]">
                                  <input
                                    type="radio"
                                    name="quality-comp"
                                    value="LT"
                                    checked={qualityFilterComp === "LT"}
                                    onChange={() => setQualityFilterComp("LT")}
                                  />
                                  <span>&lt;</span>
                                </label>
                                <span className="text-[11px] text-slate-600">
                                  soglia {qualityFilterComp === "GT" ? "maggiore di" : "minore di"}{" "}
                                  <span className="font-semibold">{qualityFilterValue}%</span>
                                </span>
                              </div>
                              <div
                                className="px-1"
                                onMouseDown={(e) => e.stopPropagation()}
                                onDragStart={(e) => e.preventDefault()}
                              >
                                <Slider
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={qualityFilterValue}
                                  onChange={(val) => {
                                    const next = Array.isArray(val) ? val[0] : (val as number);
                                    setQualityFilterValue(next);
                                  }}
                                  trackStyle={[{ backgroundColor: "#0ea5e9" }]}
                                  handleStyle={[
                                    {
                                      borderColor: "#0ea5e9",
                                      backgroundColor: "#fff",
                                      width: 16,
                                      height: 16,
                                      marginTop: -6,
                                      boxShadow: "0 0 0 2px rgba(14,165,233,0.25)",
                                    },
                                  ]}
                                  railStyle={{ backgroundColor: "#e2e8f0" }}
                          />
                        </div>
                      </div>
                    )}