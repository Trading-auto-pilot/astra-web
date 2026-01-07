                          {momentumFilterEnabled && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1 text-[11px]">
                                  <input
                                    type="radio"
                                    name="momentum-comp"
                                    value="GT"
                                    checked={momentumFilterComp === "GT"}
                                    onChange={() => setMomentumFilterComp("GT")}
                                  />
                                  <span>&gt;</span>
                                </label>
                                <label className="flex items-center gap-1 text-[11px]">
                                  <input
                                    type="radio"
                                    name="momentum-comp"
                                    value="LT"
                                    checked={momentumFilterComp === "LT"}
                                    onChange={() => setMomentumFilterComp("LT")}
                                  />
                                  <span>&lt;</span>
                                </label>
                                <span className="text-[11px] text-slate-600">
                                  soglia {momentumFilterComp === "GT" ? "maggiore di" : "minore di"}{" "}
                                  <span className="font-semibold">{momentumFilterValue}%</span>
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
                                  value={momentumFilterValue}
                                  onChange={(val) => {
                                    const next = Array.isArray(val) ? val[0] : (val as number);
                                    setMomentumFilterValue(next);
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



                    {s === "Momentum score" && (
                      <div className="mt-2 rounded border border-slate-200 bg-white px-2 py-2 text-[12px] text-slate-700">
                        <div className="font-semibold text-[11px] text-slate-900">Formula</div>
                        <div className="mt-1 text-[13px] font-mono leading-6 text-slate-800">
                          <div className="grid w-full grid-rows-2 grid-cols-4 items-center gap-x-3">
                            <div className="row-span-2 self-center">raw_mom =</div>
                            <div className="self-end text-center" style={{ gridColumn: 2, gridRow: 1 }}>
                              <span style={{ color: momentumColors[0] }}>W</span>
                              <sub style={{ color: momentumColors[0] }}>20</sub>·r20
                            </div>
                            <div className="self-end text-center" style={{ gridColumn: 3, gridRow: 1 }}>
                              <span style={{ color: momentumColors[1] }}>W</span>
                              <sub style={{ color: momentumColors[1] }}>60</sub>·r60
                            </div>
                            <div className="self-end text-center" style={{ gridColumn: 4, gridRow: 1 }}>
                              <span style={{ color: momentumColors[2] }}>W</span>
                              <sub style={{ color: momentumColors[2] }}>120</sub>·r120
                            </div>
                            <div
                              className="self-start text-center text-[11px]"
                              style={{ color: momentumColors[0], gridColumn: 2, gridRow: 2 }}
                            >
                              ({(momentumWeights.w20 / 100).toFixed(2)})
                            </div>
                            <div
                              className="self-start text-center text-[11px]"
                              style={{ color: momentumColors[1], gridColumn: 3, gridRow: 2 }}
                            >
                              ({(momentumWeights.w60 / 100).toFixed(2)})
                            </div>
                            <div
                              className="self-start text-center text-[11px]"
                              style={{ color: momentumColors[2], gridColumn: 4, gridRow: 2 }}
                            >
                              ({(momentumWeights.w120 / 100).toFixed(2)})
                            </div>
                          </div>
                        </div>
                        <div
                          className="mt-2 px-1"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                          }}
                          onDragStart={(e) => e.preventDefault()}
                        >
                          <Range
                            min={0}
                            max={100}
                            step={1}
                            value={momentumHandles}
                            allowCross={false}
                            pushable={1}
                            onChange={(vals: number | number[]) => {
                              if (Array.isArray(vals) && vals.length === 2) setMomentumHandles(vals as number[]);
                            }}
                            trackStyle={momentumHandles.map(() => ({ backgroundColor: "transparent" }))}
                            handleStyle={momentumHandles.map(() => ({
                              borderColor: "#0ea5e9",
                              backgroundColor: "#fff",
                              width: 16,
                              height: 16,
                              marginTop: -6,
                              boxShadow: "0 0 0 2px rgba(14,165,233,0.25)",
                            }))}
                            railStyle={{
                              background: `linear-gradient(90deg,
                                ${momentumColors[0]} 0%,
                                ${momentumColors[0]} ${momentumHandles[0]}%,
                                ${momentumColors[1]} ${momentumHandles[0]}%,
                                ${momentumColors[1]} ${momentumHandles[1]}%,
                                ${momentumColors[2]} ${momentumHandles[1]}%,
                                ${momentumColors[2]} 100%)`,
                            }}
                          />
                        </div>
                        <div className="mt-3 rounded border border-slate-200 bg-slate-50 px-2 py-2 text-[12px] text-slate-700">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={momentumFilterEnabled}
                              onChange={(e) => setMomentumFilterEnabled(e.target.checked)}
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                            />
                            <span>Lista solo i tick con Momentum score sopra/sotto soglia</span>
                          </label>
                        </div>
                      </div>
                    )}