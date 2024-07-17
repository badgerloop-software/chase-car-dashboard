import pandas as pd
from argparse import ArgumentParser
from pathlib import Path
import plotly.graph_objects as go
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
        hidden_signals = set(relevant_signals) - signals

        fig = go.Figure()

        for sig in signals:
            fig.add_trace(go.Scatter(x=data.index.values, y=data[sig].values, visible=True, name=sig))
        for sig in hidden_signals:
            fig.add_trace(go.Scatter(x=data.index.values, y=data[sig].values, visible='legendonly', name=sig))

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
