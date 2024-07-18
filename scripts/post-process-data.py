import pandas as pd
from argparse import ArgumentParser
from pathlib import Path
from datetime import datetime
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import json
import re


DATA_TYPE_IDX = 1
FLAG_TYPE = 'bool'


if __name__ == '__main__':
    # Get all boolean signals (flags) that have explicit state transitions to track
    data_format_path = Path(__file__).parent.parent / 'Backend' / 'Data' / 'sc1-data-format' / 'format.json'
    print(data_format_path)
    with open(data_format_path, 'r') as data_format_fp:
        data_format_json = json.load(data_format_fp)

    flag_sigs = [
        sig
        for sig, info in data_format_json.items()
        if info[DATA_TYPE_IDX] == FLAG_TYPE
    ]

    argparser = ArgumentParser()
    argparser.add_argument('-d', '--data-path', type=Path, required=True, help='Path to data download csv')
    argparser.add_argument('-s', '--signals', nargs='*', choices=flag_sigs, default=[], help='Signals whose transitions should be tracked')
    argparser.add_argument('-p', '--plot', action='store_true', help='Signals whose transitions should be tracked')
    argparser.add_argument('-r', '--rolling-average', type=int, default=1, help='If specified, compute a rolling average for non-boolean data using strides of the specified number of timestamps')
    args = argparser.parse_args()

    # The file needs to exist to be parsed
    assert (data_path := args.data_path).is_file()

    data = pd.read_csv(data_path, index_col=0)

    # The signals and timestamps need to exist in the file to be parse
    signals = set(args.signals)
    assert all(sig in data.columns for sig in signals)

    if args.plot:
        # Plot all signals, with any specified signals shown
        relevant_signals = set([
            sig 
            for sig in data_format_json.keys()
            if re.match(r'tstamp_*', sig) is None
        ])
        non_flag_signals = relevant_signals - set(flag_sigs)
        for sig in non_flag_signals:
            data[sig] = data[sig].rolling(args.rolling_average).mean()

        # Convert Unix timestamps to datetime
        data.index = data.index.to_series().apply(lambda x: datetime.fromtimestamp(x / 1000.0))
        fig = make_subplots(specs=[[{"secondary_y": True}]])

        # Add flags and other data with separate y axes for scaling
        for sig in sorted(relevant_signals):
            if sig in flag_sigs:
                yaxis = "y"
                secondary_y = False
            else:
                yaxis = "y1"
                secondary_y = True
            fig.add_trace(
                go.Scatter(
                    x=data.index.values,
                    y=data[sig].values,
                    visible=(True if sig in signals else 'legendonly'),
                    name=sig,
                    yaxis=yaxis
                ),
                secondary_y=secondary_y
            )
        fig.update_xaxes(title_text="Timestamp")
        fig.update_yaxes(title_text="Flags", secondary_y=False)
        fig.update_yaxes(title_text="Other", secondary_y=True)

        # Show data for all values at a given timestamp
        fig.update_layout(hovermode='x unified', legend_traceorder='normal')

        fig.show()
    else:
        # Get all timestamps where specified signals transition values
        data = data[signals]
        signals_by_timestamp = {}
        for sig in signals:
            _timestamps = set(data[sig][1:][data[sig].diff()[1:].astype(int) != 0].dropna().index.values)

            # Timestamps will be unique for the current signal
            init_timestamps = signals_by_timestamp.keys()
            for t in _timestamps:
                if t in init_timestamps:
                    signals_by_timestamp[t].append(sig)
                else:
                    signals_by_timestamp[t] = [sig]

        max_sig_name_len = max([len(sig) for sig in signals])
        print(max_sig_name_len)

        # Format lines for file
        lines = [
            f"{t} -"
            + ' |'.join([
                f' {s:^{max_sig_name_len}}' for s in sigs 
            ])
            + '\n'
            for t, sigs in signals_by_timestamp.items()
        ]

        print(''.join(lines))
        with open('timestamps.txt', 'w+') as tf:
            tf.writelines(lines)
        print("Timestamps and corresponding signals transitioning written to timestamps.txt")
