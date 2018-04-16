public class Main {
	public static void main(String[] args) {
		Road road = new Road(4, 4, 0.25);
		
		road.drawGrid();
		System.out.println();
		road.showPaths();
		System.out.println();
		road.showAnswer();
	}
}
