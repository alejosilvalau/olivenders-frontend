import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AlertType } from '../shared/components/alert/alert.component.js';

export function chainedEntitySearch(
  term: string,
  searchChain: Array<(term: string) => Observable<any>>,
  setResults: (results: any[]) => void,
  alertComponent: any,
  notFoundMessage: string
) {
  const trimmedTerm = term.trim();
  if (!trimmedTerm) {
    setResults([]);
    return;
  }

  let chain = searchChain.reduceRight((next, searchFn) => {
    return (t: string) => searchFn(t).pipe(
      catchError(() => next(t))
    );
  }, () => of([]));

  chain(trimmedTerm).subscribe({
    next: res => {
      const results = res.data
        ? (Array.isArray(res.data) ? res.data : [res.data])
        : [];
      setResults(results);
      if (!results.length) {
        alertComponent.showAlert(notFoundMessage, AlertType.Info);
      }
    },
    error: () => {
      setResults([]);
      alertComponent.showAlert(notFoundMessage, AlertType.Error);
    }
  });
}
