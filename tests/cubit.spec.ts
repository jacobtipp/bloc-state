import { Observable, tap } from "rxjs";
import { Cubit } from "../lib";
import { CounterCubit } from "./counter/counter.cubit";

describe("Cubit", () => {
  let cubit: CounterCubit;
  let state$: Observable<number>;

  beforeEach(() => {
    cubit = new CounterCubit();
    state$ = cubit.state$;
  });

  it("should create a new Cubit instance", () => {
    expect(cubit).toBeInstanceOf(Cubit);
  });

  it("should close a cubit", (done) => {
    cubit.close();
    cubit.state$.subscribe({
      complete: () => done(),
    });
  });

  it("should return new state from actions", (done) => {
    const states: number[] = [];
    state$.pipe(tap((state) => states.push(state))).subscribe({
      complete: () => {
        const [first, second, third] = states;
        expect(states.length).toBe(3);
        expect(first).toBe(0);
        expect(second).toBe(1);
        expect(third).toBe(2);
        done();
      },
    });
    cubit.increment();
    cubit.increment();
    cubit.close();
  });

  it("should handle async actions", (done) => {
    void (async () => {
      const states: number[] = [];
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
          const [first, second, third, fourth] = states;
          expect(states.length).toBe(4);
          expect(first).toBe(0);
          expect(second).toBe(1);
          expect(third).toBe(0);
          expect(fourth).toBe(1);
          done();
        },
      });
      await cubit.asyncIncrement();
      cubit.close();
    })();
  });

  describe("Cubit.onError", () => {
    let errors: Error[] = [];

    class OnEmitError extends Error {
      override message = "emit error";
    }

    class OnChangeError extends Error {
      override message = "onchange error";
    }

    class ErrorTestBloc extends Cubit<number> {
      constructor() {
        super(0);
      }

      triggerError() {
        this.emit((state) => {
          throw new OnEmitError();
        });
      }

      triggerChange() {
        this.emit(1);
      }

      protected override onChange(current: number, next: number): void {
        throw new OnChangeError();
      }

      protected override onError(error: Error): void {
        errors.push(error);
      }
    }

    let errorBloc: ErrorTestBloc;

    beforeEach(() => {
      errorBloc = new ErrorTestBloc();
      errors = [];
    });

    afterEach(() => {
      errorBloc.close();
    });

    it("should be invoked when an error is thrown from BlocBase.emit", () => {
      errorBloc.triggerError();
      const [a] = errors;

      expect(a.message).toBe("emit error");
    });

    it("should be invoked when an error is thrown from BlocBase.onChange", () => {
      errorBloc.triggerChange();
      const [a] = errors;

      expect(a.message).toBe("onchange error");
    });
  });

  it("should not emit values if the bloc is closed", (done) => {
    const states: number[] = [];
    cubit.state$.subscribe({
      next: (state) => states.push(state),
    });

    cubit.emit(2);
    cubit.emit((previous) => previous + 1);

    cubit.close();

    cubit.emit(4);
    cubit.emit((previous) => previous + 1);

    const [a, b, c] = states;

    expect(states.length).toBe(3);
    expect(a).toBe(0);
    expect(b).toBe(2);
    expect(c).toBe(3);
    done();
  });

  describe("Cubit.select", () => {
    type Car = {
      brand: string;
      year: number;
    };

    class CarBloc extends Cubit<Car> {
      constructor(car: Car) {
        super(car);
      }

      brandsFiltered$ = this.select({
        selector: (car) => car.brand,
        filter: (brand) => brand.length <= 4,
      });

      brand$ = this.select((car) => car.brand);

      year$ = this.select({
        selector: (car) => car.year,
      });

      updateCar(car: Partial<Car>) {
        this.emit((previous) => ({ ...previous, ...car }));
      }
    }

    let bloc: CarBloc;

    beforeEach(() => {
      bloc = new CarBloc({ brand: "ford", year: 2021 });
    });

    it("should map cars mapped state", (done) => {
      const brands: string[] = [];

      bloc.brand$.subscribe({
        next: (brand) => brands.push(brand),
        complete: () => {
          const [a, b, c, d] = brands;
          expect(brands.length).toBe(4);
          expect(a).toBe("ford");
          expect(b).toBe("toyota");
          expect(c).toBe("mercedes");
          expect(d).toBe("bmw");
          done();
        },
      });

      bloc.updateCar({ brand: "toyota" });
      bloc.updateCar({ brand: "mercedes" });
      bloc.updateCar({ brand: "bmw" });
      bloc.updateCar({ year: 2022 });
      bloc.close();
    });

    it("should map years to selected state", (done) => {
      const years: number[] = [];

      bloc.year$.subscribe({
        next: (year) => years.push(year),
        complete: () => {
          const [a, b] = years;

          expect(years.length).toBe(2);
          expect(a).toBe(2021);
          expect(b).toBe(2022);
          done();
        },
      });

      bloc.updateCar({ brand: "toyota" });
      bloc.updateCar({ brand: "mercedes" });
      bloc.updateCar({ brand: "bmw" });
      bloc.updateCar({ year: 2022 });
      bloc.close();
    });

    it("should filter selected mapped state", (done) => {
      const brands: string[] = [];
      bloc.brandsFiltered$.subscribe({
        next: (brand) => brands.push(brand),
        complete: () => {
          const [a, b] = brands;

          expect(brands.length).toBe(2);
          expect(a).toBe("ford");
          expect(b).toBe("bmw");
          done();
        },
      });

      bloc.updateCar({ brand: "toyota" });
      bloc.updateCar({ brand: "mercedes" });
      bloc.updateCar({ brand: "bmw" });
      bloc.updateCar({ year: 2022 });

      bloc.close();
    });
  });
});
